const STACK_SECTIONS = [
  {
    title: "Frontend",
    summary: "React 18 + React Router power the interface layer.",
    color: "#38bdf8",
    items: [
      {
        tool: "React 18",
        why: "Used for component-based screens like Dashboard, Advisor, Market, Portfolio, and Learn.",
      },
      {
        tool: "React Router",
        why: "Handles navigation between pages without a full page reload.",
      },
      {
        tool: "Inline styled UI",
        why: "Keeps the terminal-style visual language close to each page for fast iteration.",
      },
    ],
  },
  {
    title: "Backend",
    summary: "FastAPI exposes the app’s market and advisor endpoints.",
    color: "#22c55e",
    items: [
      {
        tool: "FastAPI",
        why: "Lightweight Python API framework with clean routing and good fit for ML-backed endpoints.",
      },
      {
        tool: "Uvicorn",
        why: "Runs the ASGI app and supports the real-time backend workflow cleanly.",
      },
      {
        tool: "Pydantic",
        why: "Validates request bodies like advisor questions and keeps API inputs structured.",
      },
    ],
  },
  {
    title: "Market Data",
    summary: "Live quotes and history are fetched from Yahoo Finance.",
    color: "#f59e0b",
    items: [
      {
        tool: "yfinance",
        why: "Simple way to pull market prices and intraday history for a prototype without paid exchange feeds.",
      },
      {
        tool: "WebSocket + polling fallback",
        why: "Keeps the dashboard updating in near real time while still working if the socket drops.",
      },
      {
        tool: "Pandas",
        why: "Used to normalize and read historical OHLCV data returned by the market feed.",
      },
    ],
  },
  {
    title: "AI / RAG",
    summary: "The advisor combines retrieval, embeddings, and an LLM response layer.",
    color: "#a78bfa",
    items: [
      {
        tool: "sentence-transformers",
        why: "Creates text embeddings so financial knowledge can be searched semantically.",
      },
      {
        tool: "all-MiniLM-L6-v2",
        why: "Small and fast embedding model that is good enough for lightweight local RAG.",
      },
      {
        tool: "ChromaDB",
        why: "Stores embeddings and retrieves the most relevant knowledge snippets for a user query.",
      },
      {
        tool: "Groq API",
        why: "Provides fast LLM inference when a valid API key is configured.",
      },
    ],
  },
];

const PIPELINE = [
  { step: "1", title: "User asks a question", detail: "The Advisor page sends the question to the backend." },
  { step: "2", title: "Relevant context is retrieved", detail: "The query is embedded and searched against ChromaDB." },
  { step: "3", title: "Market snapshot is attached", detail: "Current market values are added so answers stay grounded." },
  { step: "4", title: "LLM or fallback response is generated", detail: "Groq responds when available, otherwise the app uses a local fallback path." },
  { step: "5", title: "Answer returns to the UI", detail: "The frontend renders the response inside the Advisor chat experience." },
];

const CHOICES = [
  {
    title: "Why React?",
    text: "This app has several dashboard-like pages with shared navigation and repeated UI blocks. React keeps those screens modular and easier to evolve.",
  },
  {
    title: "Why FastAPI?",
    text: "The project mixes REST endpoints, WebSocket updates, and AI-driven handlers. FastAPI is a clean fit for that Python-heavy workflow.",
  },
  {
    title: "Why ChromaDB + embeddings?",
    text: "A plain keyword search is weak for financial questions. Embeddings help the advisor retrieve meaningfully similar context before answering.",
  },
  {
    title: "Why yfinance?",
    text: "For a learning project and prototype, it offers fast access to market data without the cost and setup of broker-grade feeds.",
  },
];

const RAG_PIPELINE = [
  {
    phase: "1. Knowledge Base",
    description: "Financial knowledge documents are stored in ChromaDB as text embeddings",
    details: [
      "Static knowledge: RBI policies, market trends, investment principles",
      "Dynamic knowledge: User-uploaded bank statements (PDFs)",
      "Text is chunked into 500-character segments for better retrieval",
      "Each chunk is converted to a 384-dimensional vector embedding"
    ]
  },
  {
    phase: "2. Query Processing",
    description: "User questions are converted to embeddings for semantic search",
    details: [
      "Question text is embedded using the same model as the knowledge base",
      "Embedding captures semantic meaning, not just keywords",
      "Query embedding is compared against all stored document embeddings"
    ]
  },
  {
    phase: "3. Retrieval",
    description: "Most relevant document chunks are retrieved from ChromaDB",
    details: [
      "Cosine similarity finds the closest matching embeddings",
      "Top 3 most relevant chunks are retrieved for each query",
      "Retrieved chunks serve as context for the LLM"
    ]
  },
  {
    phase: "4. Context Augmentation",
    description: "Retrieved context is combined with real-time market data",
    details: [
      "Live market prices are fetched from Yahoo Finance",
      "Market snapshot is formatted and added to the prompt",
      "This ensures answers are grounded in current market conditions"
    ]
  },
  {
    phase: "5. Generation",
    description: "LLM generates response using retrieved context and market data",
    details: [
      "Groq API (Llama 3.1 8B) provides fast inference when API key is available",
      "Fallback mode uses template-based responses when API is unavailable",
      "Response is constrained to 3-4 sentences with actionable insights",
      "Sources are cited as [Source 1], [Source 2], etc."
    ]
  }
];

function Learn() {
  return (
    <div
      style={{
        minHeight: "100vh",
        marginLeft: "var(--app-shell-offset, 250px)",
        padding: "28px",
        background:
          "radial-gradient(circle at top left, rgba(56,189,248,0.1), transparent 28%), radial-gradient(circle at top right, rgba(34,197,94,0.08), transparent 24%), #020817",
        color: "#e2e8f0",
        fontFamily: "'IBM Plex Mono','Courier New',monospace",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <section
          style={{
            padding: "28px 30px",
            borderRadius: 28,
            border: "1px solid rgba(148,163,184,0.12)",
            background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(5,10,21,0.96))",
            boxShadow: "0 24px 60px rgba(2,6,23,0.42)",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 11, color: "#7c8aa5", letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Learn
          </div>
          <h1 style={{ margin: "12px 0 10px", fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.05 }}>
            Tech stack, explained cleanly
          </h1>
          <p style={{ margin: 0, maxWidth: 820, color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>
            This project is a financial RAG app with a React frontend, a FastAPI backend, live market data from
            Yahoo Finance, and a lightweight retrieval pipeline for the advisor. Below is the actual stack used in
            this repo and the reason each layer exists.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 20,
            marginBottom: 24,
          }}
          className="learn-top-grid"
        >
          <div
            style={{
              padding: 24,
              borderRadius: 24,
              border: "1px solid rgba(148,163,184,0.12)",
              background: "rgba(15,23,42,0.72)",
            }}
          >
            <div style={{ fontSize: 11, color: "#7c8aa5", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
              Architecture Flow
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {PIPELINE.map((item) => (
                <div
                  key={item.step}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "54px 1fr",
                    gap: 14,
                    padding: 16,
                    borderRadius: 18,
                    border: "1px solid rgba(148,163,184,0.08)",
                    background: "rgba(2,6,23,0.42)",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(56,189,248,0.14)",
                      color: "#38bdf8",
                      fontWeight: 700,
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 24,
              borderRadius: 24,
              border: "1px solid rgba(148,163,184,0.12)",
              background: "rgba(15,23,42,0.72)",
            }}
          >
            <div style={{ fontSize: 11, color: "#7c8aa5", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
              In This Repo
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                "Frontend: React 18, React Router, react-scripts",
                "Backend: FastAPI, Uvicorn, Pydantic",
                "Data: yfinance, pandas, pytz",
                "RAG: sentence-transformers, all-MiniLM-L6-v2, ChromaDB",
                "LLM: Groq API with fallback behavior",
                "Utilities: python-dotenv, httpx, python-multipart",
              ].map((line) => (
                <div
                  key={line}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: "1px solid rgba(148,163,184,0.08)",
                    background: "rgba(2,6,23,0.42)",
                    color: "#cbd5e1",
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#7c8aa5", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
            Stack Breakdown
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {STACK_SECTIONS.map((section) => (
              <div
                key={section.title}
                style={{
                  padding: 22,
                  borderRadius: 24,
                  border: "1px solid rgba(148,163,184,0.12)",
                  background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(5,10,21,0.94))",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: `1px solid ${section.color}55`,
                    background: `${section.color}14`,
                    color: section.color,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  {section.title}
                </div>
                <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{section.summary}</div>
                <div style={{ display: "grid", gap: 12 }}>
                  {section.items.map((item) => (
                    <div
                      key={item.tool}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 16,
                        border: "1px solid rgba(148,163,184,0.08)",
                        background: "rgba(2,6,23,0.4)",
                      }}
                    >
                      <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{item.tool}</div>
                      <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6 }}>{item.why}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: 24,
            borderRadius: 24,
            border: "1px solid rgba(148,163,184,0.12)",
            background: "rgba(15,23,42,0.72)",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 11, color: "#7c8aa5", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
            Why These Choices
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {CHOICES.map((choice) => (
              <div
                key={choice.title}
                style={{
                  padding: 18,
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.08)",
                  background: "rgba(2,6,23,0.42)",
                }}
              >
                <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{choice.title}</div>
                <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.65 }}>{choice.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: 28,
            borderRadius: 24,
            border: "1px solid rgba(167,139,250,0.2)",
            background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(5,10,21,0.96))",
          }}
        >
          <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 20 }}>
            RAG Pipeline Deep Dive
          </div>
          <div style={{ color: "#f8fafc", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            How Retrieval-Augmented Generation Works
          </div>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 800 }}>
            The RAG (Retrieval-Augmented Generation) pipeline combines information retrieval with large language model generation to provide accurate, context-aware financial advice. Here's how each phase works:
          </p>
          
          <div style={{ display: "grid", gap: 20 }}>
            {RAG_PIPELINE.map((item, index) => (
              <div
                key={item.phase}
                style={{
                  padding: 24,
                  borderRadius: 20,
                  border: "1px solid rgba(167,139,250,0.15)",
                  background: "rgba(2,6,23,0.5)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(167,139,250,0.2)",
                      color: "#a78bfa",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700 }}>{item.phase}</div>
                </div>
                <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                  {item.description}
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {item.details.map((detail) => (
                    <div
                      key={detail}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 14px",
                        borderRadius: 12,
                        background: "rgba(167,139,250,0.08)",
                        border: "1px solid rgba(167,139,250,0.1)",
                      }}
                    >
                      <div style={{ color: "#a78bfa", fontSize: 10, marginTop: 2 }}>→</div>
                      <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6 }}>{detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        @media (max-width: 1100px) {
          .learn-top-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Learn;
