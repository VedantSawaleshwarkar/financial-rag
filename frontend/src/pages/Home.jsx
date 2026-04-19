import { Link } from "react-router-dom";

const Home = () => {
  const pipelineSteps = [
    { step: "Data Ingestion", desc: "Real-time market data from Yahoo Finance", icon: "DATA" },
    { step: "Storage Engine", desc: "ChromaDB vector database for embeddings", icon: "STORE" },
    { step: "Backend Engine", desc: "FastAPI server with MiniLM embeddings", icon: "API" },
    { step: "LLM Inference", desc: "Groq LLaMA 3 for intelligent responses", icon: "LLM" },
    { step: "Output Processing", desc: "Structured financial analysis and insights", icon: "PROC" },
    { step: "Advisory Dashboard", desc: "Interactive terminal interface", icon: "TERM" },
  ];

  const techStack = [
    { name: "yfinance", desc: "Real-time market data", color: "#10b981" },
    { name: "ChromaDB", desc: "Vector database", color: "#3b82f6" },
    { name: "MiniLM", desc: "Text embeddings", color: "#8b5cf6" },
    { name: "Groq", desc: "LLM inference", color: "#f59e0b" },
    { name: "FastAPI", desc: "Backend framework", color: "#ef4444" },
    { name: "React", desc: "Frontend framework", color: "#06b6d4" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020817",
      color: "#e2e8f0",
      fontFamily: "'IBM Plex Mono','Courier New',monospace",
      overflowX: "hidden"
    }}>
      
      {/* Hero Section */}
      <section style={{
        padding: "80px 20px",
        textAlign: "center",
        background: "linear-gradient(135deg, #020817 0%, #0f172a 100%)",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at center, rgba(16,185,129,0.1) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            fontSize: "12px",
            color: "#10b981",
            letterSpacing: "2px",
            marginBottom: "20px",
            fontWeight: "600"
          }}>
            AI-POWERED FINANCIAL INTELLIGENCE
          </div>
          
          <h1 style={{
            fontSize: "48px",
            fontWeight: "800",
            color: "#f1f5f9",
            marginBottom: "20px",
            letterSpacing: "3px",
            lineHeight: "1.1"
          }}>
            <span style={{ color: "#10b981" }}>FIN</span>AI RAG TERMINAL
          </h1>
          
          <p style={{
            fontSize: "20px",
            color: "#94a3b8",
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: "1.6"
          }}>
            AI-Powered Financial Advisory for Indian Markets
          </p>
          
          <Link
            to="/dashboard"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              padding: "16px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(16,185,129,0.2)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 12px rgba(16,185,129,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(16,185,129,0.2)";
            }}
          >
            LAUNCH TERMINAL
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: "80px 20px",
        background: "#020817"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            fontSize: "12px",
            color: "#334155",
            letterSpacing: "2px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            HOW IT WORKS
          </div>
          
          <h2 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#f1f5f9",
            marginBottom: "60px",
            textAlign: "center"
          }}>
            6-Block RAG Pipeline
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px"
          }}>
            {pipelineSteps.map((step, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(13,17,23,0.8)",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  padding: "30px",
                  position: "relative",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#10b981";
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1e293b";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "-20px",
                  left: "30px",
                  background: "#10b981",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "10px",
                  fontWeight: "600",
                  letterSpacing: "1px"
                }}>
                  {index + 1}
                </div>
                
                <div style={{
                  fontSize: "12px",
                  color: "#10b981",
                  letterSpacing: "1.5px",
                  marginBottom: "12px",
                  fontWeight: "600"
                }}>
                  {step.step}
                </div>
                
                <div style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  lineHeight: "1.6",
                  marginBottom: "20px"
                }}>
                  {step.desc}
                </div>
                
                <div style={{
                  fontSize: "10px",
                  color: "#334155",
                  fontFamily: "monospace",
                  opacity: 0.7
                }}>
                  {step.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{
        padding: "80px 20px",
        background: "linear-gradient(135deg, #0f172a 0%, #020817 100%)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            fontSize: "12px",
            color: "#334155",
            letterSpacing: "2px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            TECHNOLOGY STACK
          </div>
          
          <h2 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#f1f5f9",
            marginBottom: "60px",
            textAlign: "center"
          }}>
            Built with Modern Tools
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px"
          }}>
            {techStack.map((tech, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(13,17,23,0.8)",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  padding: "24px",
                  textAlign: "center",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tech.color;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1e293b";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: tech.color,
                  marginBottom: "8px"
                }}>
                  {tech.name}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  lineHeight: "1.4"
                }}>
                  {tech.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "80px 20px",
        background: "#020817",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#f1f5f9",
            marginBottom: "20px"
          }}>
            Ready to Experience AI-Powered Financial Intelligence?
          </h2>
          
          <p style={{
            fontSize: "16px",
            color: "#94a3b8",
            marginBottom: "40px",
            lineHeight: "1.6"
          }}>
            Get real-time market insights, AI-powered analysis, and intelligent financial advisory all in one terminal.
          </p>
          
          <Link
            to="/dashboard"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              padding: "16px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(16,185,129,0.2)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 12px rgba(16,185,129,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(16,185,129,0.2)";
            }}
          >
            START USING FINAI RAG
          </Link>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:#020817}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
        body{background:#020817}
      `}</style>
    </div>
  );
};

export default Home;
