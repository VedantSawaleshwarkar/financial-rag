import { Link } from "react-router-dom";

const pipelineSteps = [
  { step: "Market Feed", desc: "Live and fallback market prices flow into the backend data layer." },
  { step: "Storage", desc: "ChromaDB stores vectorized financial knowledge for retrieval." },
  { step: "API Layer", desc: "FastAPI serves prices, charts, and advisor endpoints." },
  { step: "Reasoning", desc: "Groq or fallback logic generates grounded advisor responses." },
];

const productHighlights = [
  {
    title: "Live dashboard",
    text: "Focused market cards, clearer charting, and status-aware data sourcing.",
  },
  {
    title: "AI advisor",
    text: "RAG-backed market answers with graceful fallback behavior when AI services fail.",
  },
  {
    title: "Portfolio workspace",
    text: "Simple holdings tracking and P&L visibility inside the same interface shell.",
  },
];

const techStack = [
  "React 18",
  "FastAPI",
  "yfinance",
  "ChromaDB",
  "MiniLM",
  "Groq",
];

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(16,185,129,0.12), transparent 22%), radial-gradient(circle at top right, rgba(56,189,248,0.12), transparent 24%), #020817",
        color: "#e2e8f0",
        fontFamily: "'IBM Plex Mono','Courier New',monospace",
        overflowX: "hidden",
      }}
    >
      <section style={{ padding: "34px 24px 18px" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ color: "#10b981", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
              Financial Intelligence Terminal
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.2em" }}>
              <span style={{ color: "#10b981" }}>FIN</span>AI RAG
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/login" style={ghostButton}>
              Login
            </Link>
            <Link to="/signup" style={primaryButton}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "28px 24px 48px" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.08fr 0.92fr",
            gap: 24,
          }}
          className="home-hero-grid"
        >
          <div
            style={{
              padding: "38px",
              borderRadius: 32,
              border: "1px solid rgba(148,163,184,0.12)",
              background: "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(5,10,21,0.96))",
              boxShadow: "0 24px 60px rgba(2,6,23,0.42)",
            }}
          >
            <div style={{ color: "#7c8aa5", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
              AI-powered financial workspace
            </div>
            <h1 style={{ margin: "0 0 14px", fontSize: "clamp(40px, 7vw, 68px)", lineHeight: 0.98 }}>
              Cleaner markets.
              <br />
              Better context.
            </h1>
            <p style={{ margin: 0, maxWidth: 620, fontSize: 15, lineHeight: 1.85, color: "#94a3b8" }}>
              FinAI RAG combines a terminal-style market interface, live pricing, and a lightweight retrieval-based
              advisor so you can move between data, explanation, and decision support in one place.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 26 }}>
              <Link to="/signup" style={primaryButton}>
                Start with signup
              </Link>
              <Link to="/learn" style={ghostButton}>
                Explore the stack
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 14,
                marginTop: 30,
              }}
            >
              {[
                { label: "Shell", value: "Auth + collapsible nav" },
                { label: "Data", value: "Live + fallback pricing" },
                { label: "Advisor", value: "RAG + resilient responses" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 18,
                    border: "1px solid rgba(148,163,184,0.08)",
                    background: "rgba(2,6,23,0.44)",
                  }}
                >
                  <div style={{ color: "#64748b", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{stat.label}</div>
                  <div style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700, marginTop: 8 }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                padding: 24,
                borderRadius: 28,
                border: "1px solid rgba(148,163,184,0.12)",
                background: "rgba(15,23,42,0.78)",
                boxShadow: "0 24px 60px rgba(2,6,23,0.32)",
              }}
            >
              <div style={{ color: "#7c8aa5", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
                Product highlights
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {productHighlights.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      padding: "16px 18px",
                      borderRadius: 18,
                      border: "1px solid rgba(148,163,184,0.08)",
                      background: "rgba(2,6,23,0.42)",
                    }}
                  >
                    <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.65 }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 24,
                borderRadius: 28,
                border: "1px solid rgba(148,163,184,0.12)",
                background: "rgba(15,23,42,0.78)",
                boxShadow: "0 24px 60px rgba(2,6,23,0.32)",
              }}
            >
              <div style={{ color: "#7c8aa5", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
                Core stack
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {techStack.map((tech) => (
                  <div
                    key={tech}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 999,
                      border: "1px solid rgba(148,163,184,0.12)",
                      background: "rgba(2,6,23,0.42)",
                      color: "#cbd5e1",
                      fontSize: 11,
                    }}
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 24px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ color: "#7c8aa5", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
            How it works
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {pipelineSteps.map((item, index) => (
              <div
                key={item.step}
                style={{
                  padding: "20px",
                  borderRadius: 22,
                  border: "1px solid rgba(148,163,184,0.12)",
                  background: "linear-gradient(180deg, rgba(15,23,42,0.84), rgba(5,10,21,0.94))",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 12,
                    background: "rgba(16,185,129,0.14)",
                    color: "#10b981",
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{item.step}</div>
                <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          .home-hero-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

const primaryButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  padding: "14px 18px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #10b981, #1d4ed8)",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  border: "1px solid rgba(16,185,129,0.2)",
  boxShadow: "0 14px 32px rgba(16,185,129,0.18)",
};

const ghostButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  padding: "14px 18px",
  borderRadius: "14px",
  background: "rgba(15,23,42,0.72)",
  color: "#e2e8f0",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  border: "1px solid rgba(148,163,184,0.14)",
};

export default Home;
