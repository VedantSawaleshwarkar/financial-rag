import { useState, useEffect } from "react";

const About = () => {
  const [stats, setStats] = useState({
    totalQueries: 0,
    apiCalls: 0,
    uptime: "0h 0m"
  });

  useEffect(() => {
    // Simulate loading stats
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalQueries: prev.totalQueries + Math.floor(Math.random() * 5),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 10),
        uptime: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      padding: "2rem", 
      maxWidth: "1200px", 
      margin: "0 auto",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "3rem",
        borderRadius: "16px",
        marginBottom: "2rem"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "700", 
          margin: "0 0 1rem 0",
          textAlign: "center"
        }}>
          About FinAI RAG
        </h1>
        <p style={{ 
          fontSize: "1.2rem", 
          lineHeight: "1.6",
          opacity: 0.95,
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          Advanced Financial Intelligence System powered by Retrieval-Augmented Generation (RAG) technology
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "2rem",
        marginBottom: "2rem"
      }}>
        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.0.1)",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>🚀 Technology Stack</h2>
          <ul style={{ color: "#4b5563", lineHeight: "1.8" }}>
            <li><strong>Frontend:</strong> React 18 with modern hooks</li>
            <li><strong>Backend:</strong> FastAPI with Python</li>
            <li><strong>Database:</strong> ChromaDB for vector storage</li>
            <li><strong>AI:</strong> Groq API for LLM capabilities</li>
            <li><strong>Market Data:</strong> Real-time Yahoo Finance integration</li>
          </ul>
        </div>

        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.0.1)",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>📊 Key Features</h2>
          <ul style={{ color: "#4b5563", lineHeight: "1.8" }}>
            <li>Real-time market data visualization</li>
            <li>Interactive price charts with technical indicators</li>
            <li>AI-powered financial Q&A system</li>
            <li>Historical data analysis</li>
            <li>Economic indicators dashboard</li>
            <li>Responsive design for all devices</li>
          </ul>
        </div>

        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.0.1)",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>📈 Live Statistics</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ textAlign: "center", padding: "1rem", background: "#f3f4f6", borderRadius: "8px" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>{stats.totalQueries}</div>
              <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Total Queries</div>
            </div>
            <div style={{ textAlign: "center", padding: "1rem", background: "#f3f4f6", borderRadius: "8px" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>{stats.apiCalls}</div>
              <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>API Calls</div>
            </div>
            <div style={{ textAlign: "center", padding: "1rem", background: "#f3f4f6", borderRadius: "8px" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#8b5cf6" }}>{stats.uptime}</div>
              <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        background: "white", 
        padding: "2rem", 
        borderRadius: "12px", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.0.1)",
        border: "1px solid #e5e7eb",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>🔬 Version Information</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ padding: "1rem", background: "#f9fafb", borderRadius: "8px", minWidth: "150px" }}>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Frontend</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937" }}>v1.0.0</div>
          </div>
          <div style={{ padding: "1rem", background: "#f9fafb", borderRadius: "8px", minWidth: "150px" }}>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Backend</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937" }}>v1.0.0</div>
          </div>
          <div style={{ padding: "1rem", background: "#f9fafb", borderRadius: "8px", minWidth: "150px" }}>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>API</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937" }}>v2.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
