import { useState, useEffect, useRef } from "react";
import ChatBubble from "../components/ChatBubble";

const API = "http://localhost:8000";

const QUICK_QUESTIONS = [
  "What is the current market trend?",
  "Should I invest in NIFTY 50 now?",
  "How is gold performing today?",
  "What are the key economic indicators?",
  "Explain the recent market volatility",
  "Best investment strategy for beginners?",
  "How do interest rates affect stocks?",
  "What is the outlook for Indian markets?",
];

const RAG_PIPELINE = [
  "User Question",
  "MiniLM Embed", 
  "ChromaDB Search",
  "Top 3 Docs",
  "Groq LLaMA 3",
  "AI Answer"
];

const Advisor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(false);
  const [expandedSources, setExpandedSources] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Check backend status
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API}/test`);
        setOnline(response.ok);
      } catch {
        setOnline(false);
      }
    };
    
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendQuestion = async (question) => {
    const q = (question || input).trim();
    if (!q || loading) return;
    
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q, context: "" }]);
    setLoading(true);
    
    try {
      const response = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.answer, 
        context: data.sources || "No sources available" 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: online ? "Service temporarily unavailable. Please try again." : "Backend is offline. Please start the backend server to use the AI advisor.", 
        context: "" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSources = (index) => {
    setExpandedSources(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#020817", 
      color: "#e2e8f0", 
      fontFamily: "'IBM Plex Mono','Courier New',monospace",
      display: "flex",
      marginLeft: "250px" // Account for sidebar
    }}>
      
      {/* Left Sidebar - Quick Questions & RAG Pipeline */}
      <div style={{
        width: "300px",
        background: "rgba(13,17,23,0.8)",
        borderRight: "1px solid #1e293b",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "30px"
      }}>
        {/* Quick Questions */}
        <div>
          <div style={{
            fontSize: "10px",
            color: "#334155",
            letterSpacing: "2px",
            marginBottom: "16px"
          }}>
            QUICK QUESTIONS
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            {QUICK_QUESTIONS.map((q, index) => (
              <button
                key={index}
                onClick={() => sendQuestion(q)}
                style={{
                  background: "rgba(30,41,59,0.8)",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#94a3b8",
                  padding: "12px 16px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  lineHeight: "1.4",
                  transition: "all 0.15s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#10b981";
                  e.currentTarget.style.color = "#e2e8f0";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#1e293b";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                <span style={{ color: "#10b981", marginRight: "6px", fontSize: "9px" }}>{">"}</span>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* RAG Pipeline */}
        <div>
          <div style={{
            fontSize: "10px",
            color: "#334155",
            letterSpacing: "2px",
            marginBottom: "16px"
          }}>
            RAG PIPELINE
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}>
            {RAG_PIPELINE.map((step, index) => (
              <div key={index} style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                background: "rgba(16,185,129,0.05)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "4px"
              }}>
                <div style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "#10b981"
                }} />
                <div style={{
                  fontSize: "9px",
                  color: "#10b981",
                  fontFamily: "monospace"
                }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div style={{
          marginTop: "auto",
          padding: "12px",
          background: "rgba(13,17,23,0.8)",
          border: "1px solid #1e293b",
          borderRadius: "6px"
        }}>
          <div style={{
            fontSize: "9px",
            color: "#334155",
            letterSpacing: "1.5px",
            marginBottom: "8px"
          }}>
            AI ADVISOR STATUS
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <div style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: online ? "#10b981" : "#ef4444",
              boxShadow: online ? "0 0 6px rgba(16,185,129,0.5)" : "0 0 6px rgba(239,68,68,0.5)"
            }} />
            <div style={{
              fontSize: "9px",
              color: online ? "#10b981" : "#ef4444",
              fontWeight: "600"
            }}>
              {online ? "ONLINE" : "OFFLINE"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #1e293b",
          background: "rgba(13,17,23,0.8)"
        }}>
          <h1 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#f1f5f9",
            marginBottom: "8px",
            letterSpacing: "2px"
          }}>
            <span style={{ color: "#10b981" }}>AI</span> FINANCIAL ADVISOR
          </h1>
          <div style={{
            fontSize: "12px",
            color: "#94a3b8",
            letterSpacing: "1px"
          }}>
            Powered by RAG · Groq LLaMA 3 · ChromaDB
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {messages.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "40px",
              color: "#64748b"
            }}>
              <div style={{
                fontSize: "14px",
                marginBottom: "8px"
              }}>
                Welcome to AI Financial Advisor
              </div>
              <div style={{
                fontSize: "11px",
                opacity: 0.8
              }}>
                Ask any question about Indian markets, investments, or economic trends
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index}>
              <ChatBubble msg={message} />
              
              {/* Sources Section */}
              {message.role === "assistant" && message.context && (
                <div style={{
                  marginLeft: "48px",
                  marginTop: "8px"
                }}>
                  <button
                    onClick={() => toggleSources(index)}
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.3)",
                      borderRadius: "4px",
                      color: "#10b981",
                      padding: "6px 12px",
                      fontSize: "9px",
                      fontFamily: "monospace",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(16,185,129,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(16,185,129,0.1)";
                    }}
                  >
                    <span>{expandedSources[index] ? "v" : ">"}</span>
                    Sources Used
                  </button>
                  
                  {expandedSources[index] && (
                    <div style={{
                      marginTop: "8px",
                      padding: "12px",
                      background: "rgba(13,17,23,0.8)",
                      border: "1px solid #1e293b",
                      borderRadius: "6px",
                      fontSize: "10px",
                      color: "#94a3b8",
                      fontFamily: "monospace",
                      lineHeight: "1.5"
                    }}>
                      {message.context}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "48px" }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: "50%", 
                background: "linear-gradient(135deg,#0f766e,#1d4ed8)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: 12, 
                color: "#fff", 
                fontWeight: 700 
              }}>
                AI
              </div>
              <div style={{ 
                background: "rgba(30,41,59,0.9)", 
                border: "1px solid #1e293b", 
                borderRadius: "3px 14px 14px 14px", 
                padding: "10px 14px", 
                display: "flex", 
                gap: 5, 
                alignItems: "center" 
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ 
                    width: 5, 
                    height: 5, 
                    borderRadius: "50%", 
                    background: "#10b981", 
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` 
                  }} />
                ))}
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: "20px",
          borderTop: "1px solid #1e293b",
          background: "rgba(13,17,23,0.8)"
        }}>
          <div style={{
            display: "flex",
            gap: "12px",
            marginBottom: "12px"
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
              placeholder="Ask about Indian markets, investments, or economic trends..."
              style={{
                flex: 1,
                background: "rgba(30,41,59,0.8)",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#e2e8f0",
                padding: "12px 16px",
                fontSize: "12px",
                fontFamily: "monospace",
                outline: "none"
              }}
            />
            <button
              onClick={() => sendQuestion()}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? "#0f172a" : "linear-gradient(135deg,#0f766e,#1d4ed8)",
                border: "1px solid #1e293b",
                color: loading || !input.trim() ? "#334155" : "#fff",
                borderRadius: "8px",
                padding: "12px 20px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1px",
                transition: "all 0.15s"
              }}
            >
              {loading ? "THINKING..." : "SEND"}
            </button>
          </div>
          
          {/* Disclaimer */}
          <div style={{
            fontSize: "9px",
            color: "#64748b",
            textAlign: "center",
            padding: "12px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "6px",
            lineHeight: "1.4"
          }}>
            <strong>Disclaimer:</strong> Not SEBI-registered advice. For educational purposes only. 
            Consult a qualified financial advisor before making investment decisions.
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:#020817}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
        body{background:#020817}
      `}</style>
    </div>
  );
};

export default Advisor;
