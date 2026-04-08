import os
import chromadb
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

print("Loading embedding model (first run may take 1 min)...")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

chroma  = chromadb.PersistentClient(path="./chroma_store")
col     = chroma.get_or_create_collection("financial_kb")
groq_cl = Groq(api_key=os.getenv("GROQ_API_KEY"))

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
    "Gold is a safe haven asset — prices rise during geopolitical uncertainty.",
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
    return "\n".join([f"[Source {i+1}] {d}" for i, d in enumerate(docs)])

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

    resp = groq_cl.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=350,
        temperature=0.3,
    )
    return {
        "answer": resp.choices[0].message.content,
        "context_used": context,
    }