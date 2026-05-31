import os

import chromadb
from dotenv import load_dotenv
from groq import Groq
from sentence_transformers import SentenceTransformer
import PyPDF2

load_dotenv()

print("Loading embedding model (first run may take 1 min)...")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

chroma = chromadb.PersistentClient(path="./chroma_store")
col = chroma.get_or_create_collection("financial_kb")

INVALID_KEYS = {"", "YOUR_API_KEY", '"YOUR_API_KEY"', "your_groq_api_key_here"}

demo_mode = False
groq_cl = None

try:
    api_key = (os.getenv("GROQ_API_KEY") or "").strip()
    if api_key in INVALID_KEYS:
        raise ValueError("Missing valid Groq API key")
    groq_cl = Groq(api_key=api_key)
    print("Groq API client initialized successfully")
except Exception as error:
    print(f"Groq API not available: {error}")
    print("Running in DEMO MODE - Using local fallback responses")
    demo_mode = True


KNOWLEDGE_BASE = [
    "RBI kept repo rate unchanged at 6.5% in April 2025 to manage inflation.",
    "India CPI inflation fell to 4.8% in March 2025, within RBI target band of 2-6%.",
    "Nifty 50 crossed 25,000 in 2025 driven by banking and IT sector rally.",
    "FII inflows into Indian equity markets turned positive in Q1 2025.",
    "Gold prices surged above Rs 72,000 per 10g due to global uncertainty and USD weakness.",
    "Crude oil fell below $75 per barrel as OPEC+ increased production quotas.",
    "Silver outperformed gold in Q1 2025 due to industrial demand from solar panels.",
    "SEBI introduced new F&O margin rules to protect retail investors from large losses.",
    "SIP investments in Indian mutual funds hit Rs 19,000 crore monthly in 2025.",
    "India GDP growth projected at 7.2% for FY2025-26 by IMF.",
    "USD/INR traded in 83-84 range in early 2025 due to stable RBI intervention.",
    "IT sector rally in Nifty driven by strong Q4 earnings from TCS and Infosys.",
    "Banking stocks rose after RBI liquidity injection of Rs 1.5 lakh crore.",
    "Sensex hit all-time high of 85,978 in September 2024.",
    "Crude oil imports cost India $180 billion in FY2024.",
    "Gold is a safe haven asset - prices rise during geopolitical uncertainty.",
    "Mutual fund SIP recommended for long-term wealth creation with rupee cost averaging.",
    "Nifty Bank index is key indicator of financial sector health in India.",
    "Diversification across equity, gold, and debt is recommended for Indian retail investors.",
    "Large cap stocks like Reliance, HDFC Bank, TCS carry lower risk than mid/small caps.",
]


def init_knowledge_base():
    if col.count() == 0:
        embeddings = embedder.encode(KNOWLEDGE_BASE).tolist()
        col.add(
            documents=KNOWLEDGE_BASE,
            embeddings=embeddings,
            ids=[f"doc_{i}" for i in range(len(KNOWLEDGE_BASE))],
        )
        print(f"Loaded {len(KNOWLEDGE_BASE)} docs into ChromaDB")
    else:
        print(f"ChromaDB ready with {col.count()} docs")


def retrieve_context(query: str, top_k: int = 3) -> str:
    emb = embedder.encode([query]).tolist()
    res = col.query(query_embeddings=emb, n_results=top_k)
    docs = res["documents"][0]
    return "\n".join([f"[Source {i + 1}] {doc}" for i, doc in enumerate(docs)])


def _extract_top_market_line(market_snapshot: str) -> str:
    lines = [line.strip() for line in market_snapshot.splitlines() if line.strip()]
    return lines[0] if lines else "Live market snapshot is currently limited."


def _build_demo_answer(question: str, context: str, market_snapshot: str) -> str:
    first_source = context.splitlines()[0] if context else "[Source 1] No supporting context available."
    market_line = _extract_top_market_line(market_snapshot)
    lower_question = question.lower()

    if "gold" in lower_question:
        topic_line = "Gold remains a useful defensive allocation when uncertainty is elevated, and the current market feed should be weighed alongside your time horizon."
    elif "nifty" in lower_question or "sensex" in lower_question or "market" in lower_question:
        topic_line = "The broad market view looks mixed, so it is better to focus on trend confirmation and staggered entries rather than one-shot decisions."
    elif "beginner" in lower_question or "strategy" in lower_question or "invest" in lower_question:
        topic_line = "For most retail investors, a phased SIP approach into diversified funds is usually more resilient than trying to time every swing."
    else:
        topic_line = "The available context suggests balancing current market conditions with diversification and position sizing."

    return (
        f"{topic_line} {market_line}. {first_source}. "
        "Actionable insight: use smaller staggered allocations and avoid concentrated positions until your entry plan is clear."
    )


def extract_text_from_pdf(pdf_file) -> str:
    """Extract text content from a PDF file object."""
    try:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        raise ValueError("Failed to extract text from PDF. Please ensure it's a valid PDF file.")


def add_document_to_kb(document_text: str, doc_id: str = None) -> dict:
    """Add a document to the knowledge base."""
    try:
        if doc_id is None:
            doc_id = f"uploaded_doc_{col.count()}"
        
        # Split document into chunks if it's too long
        chunk_size = 500
        chunks = [document_text[i:i+chunk_size] for i in range(0, len(document_text), chunk_size)]
        
        embeddings = embedder.encode(chunks).tolist()
        ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        
        col.add(
            documents=chunks,
            embeddings=embeddings,
            ids=ids,
        )
        
        return {
            "success": True,
            "message": f"Successfully added {len(chunks)} document chunks to knowledge base",
            "doc_id": doc_id,
            "chunks_added": len(chunks)
        }
    except Exception as e:
        print(f"Error adding document to knowledge base: {e}")
        return {
            "success": False,
            "message": f"Failed to add document to knowledge base: {str(e)}"
        }


def ask_rag(question: str, market_snapshot: str = "") -> dict:
    context = retrieve_context(question)
    prompt = f"""You are a financial advisor AI for Indian markets (NSE, BSE, MCX).
Use ONLY the context and real-time market data below. Do not hallucinate prices.

--- LIVE MARKET DATA ---
{market_snapshot}

--- KNOWLEDGE BASE ---
{context}

--- QUESTION ---
{question}

Answer in 3-4 sentences. Cite sources like [Source 1]. End with one actionable insight for an Indian retail investor."""

    if demo_mode or groq_cl is None:
        return {
            "answer": _build_demo_answer(question, context, market_snapshot),
            "context_used": context,
            "mode": "demo",
        }

    try:
        resp = groq_cl.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=350,
            temperature=0.3,
        )
        return {
            "answer": resp.choices[0].message.content,
            "context_used": context,
            "mode": "live",
        }
    except Exception as error:
        print(f"Groq request failed, switching to demo response: {error}")
        return {
            "answer": _build_demo_answer(question, context, market_snapshot),
            "context_used": context,
            "mode": "demo",
        }


def get_financial_recommendations() -> dict:
    """Generate personalized financial recommendations based on uploaded bank statement data."""
    try:
        # Retrieve context about uploaded documents
        context_query = "bank statement financial data spending patterns income expenses"
        context = retrieve_context(context_query, top_k=5)
        
        # Get current market snapshot
        from market_data import get_all_prices
        market_data = get_all_prices()
        market_snapshot = "\n".join([
            f"{k}: {v['price']} ({'+' if v['change_pct']>=0 else ''}{v['change_pct']}%)"
            for k, v in market_data.items()
        ])
        
        prompt = f"""You are a financial advisor AI analyzing a user's bank statement data.
Use the context below which contains information from their uploaded bank statements combined with current market data.

--- MARKET DATA ---
{market_snapshot}

--- BANK STATEMENT CONTEXT ---
{context}

Based on this information, provide 3-5 specific, actionable financial recommendations:
1. Analyze spending patterns and suggest areas for optimization
2. Suggest investment opportunities based on current market conditions
3. Recommend savings strategies
4. Identify potential financial risks
5. Suggest debt management strategies if applicable

Format your response as a JSON object with this structure:
{{
  "spending_analysis": "analysis of spending patterns",
  "investment_recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "savings_strategies": ["strategy1", "strategy2"],
  "risk_assessment": "assessment of financial risks",
  "overall_score": "score from 1-10 for financial health"
}}"""

        if demo_mode or groq_cl is None:
            # Fallback recommendations when no API key
            return {
                "spending_analysis": "Based on your bank statement data, review your recurring expenses and identify non-essential spending that can be reduced.",
                "investment_recommendations": [
                    "Consider starting a SIP in diversified mutual funds for long-term wealth creation",
                    "Allocate 5-10% of income to gold as a hedge against market volatility",
                    "Build an emergency fund equivalent to 6 months of expenses before aggressive investing"
                ],
                "savings_strategies": [
                    "Follow the 50-30-20 rule: 50% needs, 30% wants, 20% savings",
                    "Automate transfers to savings accounts on payday",
                    "Review and renegotiate recurring subscriptions and services"
                ],
                "risk_assessment": "Your current financial position appears stable. Focus on building emergency funds and diversifying investments.",
                "overall_score": "7",
                "mode": "demo",
                "context_used": context
            }

        try:
            resp = groq_cl.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.4,
            )
            
            # Try to parse JSON response
            import json
            try:
                recommendations = json.loads(resp.choices[0].message.content)
                recommendations["mode"] = "live"
                recommendations["context_used"] = context
                return recommendations
            except json.JSONDecodeError:
                # If JSON parsing fails, return text response
                return {
                    "spending_analysis": resp.choices[0].message.content,
                    "investment_recommendations": ["Review the detailed analysis above"],
                    "savings_strategies": ["Review the detailed analysis above"],
                    "risk_assessment": "Review the detailed analysis above",
                    "overall_score": "N/A",
                    "mode": "live",
                    "context_used": context
                }
        except Exception as error:
            print(f"Groq request failed for recommendations: {error}")
            return {
                "spending_analysis": "Unable to generate detailed analysis at this time. Please try again later.",
                "investment_recommendations": ["Start with basic SIP investments", "Build emergency fund"],
                "savings_strategies": ["Automate savings", "Track expenses"],
                "risk_assessment": "Unable to assess risks at this time",
                "overall_score": "N/A",
                "mode": "demo",
                "context_used": context
            }
            
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return {
            "error": str(e),
            "spending_analysis": "Error generating recommendations",
            "investment_recommendations": [],
            "savings_strategies": [],
            "risk_assessment": "Unable to generate assessment",
            "overall_score": "N/A",
            "mode": "error"
        }
