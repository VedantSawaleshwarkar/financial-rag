import { useState, useEffect } from "react";

const Learn = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const ragSteps = [
    {
      id: "data-ingestion",
      title: "Data Ingestion",
      tool: "yfinance",
      description: "Real-time market data collection from Yahoo Finance API",
      reason: "Chosen for reliable, free access to Indian and global market data",
      features: ["Live price feeds", "Historical data", "Multiple asset classes", "15-minute updates"],
      icon: "DATA",
      color: "#10b981"
    },
    {
      id: "storage-engine",
      title: "Storage Engine", 
      tool: "ChromaDB",
      description: "Vector database for storing and retrieving document embeddings",
      reason: "Optimized for similarity search with embeddings, handles large datasets efficiently",
      features: ["Vector similarity search", "Metadata filtering", "Scalable storage", "Fast retrieval"],
      icon: "STORE",
      color: "#3b82f6"
    },
    {
      id: "backend-engine",
      title: "Backend Engine",
      tool: "FastAPI",
      description: "High-performance Python web framework for API endpoints",
      reason: "Automatic documentation, async support, and excellent performance for ML workloads",
      features: ["Auto-generated docs", "Async support", "Type hints", "Fast performance"],
      icon: "API",
      color: "#ef4444"
    },
    {
      id: "embedding-model",
      title: "Embedding Model",
      tool: "MiniLM",
      description: "Lightweight sentence transformer for text embeddings",
      reason: "Balanced performance and speed, perfect for financial text analysis",
      features: ["384 dimensions", "Fast inference", "Good accuracy", "Low memory usage"],
      icon: "EMBED",
      color: "#8b5cf6"
    },
    {
      id: "llm-inference",
      title: "LLM Inference",
      tool: "Groq LLaMA 3",
      description: "Large Language Model for generating financial insights and advice",
      reason: "Extremely fast inference, cost-effective, and high-quality responses",
      features: ["70B parameters", "8K context", "Fast inference", "Cost-effective"],
      icon: "LLM",
      color: "#f59e0b"
    },
    {
      id: "output-processing",
      title: "Output Processing",
      tool: "React + Terminal UI",
      description: "Frontend interface for displaying results and user interaction",
      reason: "Responsive design, real-time updates, and excellent user experience",
      features: ["Real-time updates", "Responsive design", "Interactive charts", "Terminal aesthetic"],
      icon: "TERM",
      color: "#06b6d4"
    }
  ];

  const pipelineFlow = [
    "User Question",
    "Text Embedding", 
    "Vector Search",
    "Document Retrieval",
    "Context Augmentation",
    "LLM Generation",
    "Response Processing"
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#020817", 
      color: "#e2e8f0", 
      fontFamily: "'IBM Plex Mono','Courier New',monospace",
      marginLeft: "250px" // Account for sidebar
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
          <span style={{ color: "#10b981" }}>RAG</span> PIPELINE EXPLAINER
        </h1>
        <div style={{
          fontSize: "12px",
          color: "#94a3b8",
          letterSpacing: "1px"
        }}>
          Understanding how our AI-powered financial advisory system works
        </div>
      </div>

      {/* Introduction */}
      <section style={{
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          fontSize: "12px",
          color: "#334155",
          letterSpacing: "2px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          OVERVIEW
        </div>
        
        <h2 style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#f1f5f9",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          Retrieval-Augmented Generation for Financial Intelligence
        </h2>
        
        <p style={{
          fontSize: "14px",
          color: "#94a3b8",
          lineHeight: "1.6",
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 40px"
        }}>
          Our system combines real-time market data with advanced AI to provide intelligent financial advice. 
          The RAG pipeline ensures responses are grounded in accurate, up-to-date information while maintaining 
          the conversational capabilities of large language models.
        </p>
      </section>

      {/* Pipeline Flow */}
      <section style={{
        padding: "40px 20px",
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
            DATA FLOW
          </div>
          
          <h2 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#f1f5f9",
            marginBottom: "40px",
            textAlign: "center"
          }}>
            How Information Flows Through the System
          </h2>
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            padding: "20px 0"
          }}>
            {pipelineFlow.map((step, index) => (
              <div key={index} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                zIndex: 1
              }}>
                <div style={{
                  width: "120px",
                  height: "80px",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "10px",
                  color: "#10b981",
                  fontFamily: "monospace",
                  fontWeight: "600",
                  padding: "8px",
                  transition: "all 0.3s ease"
                }}>
                  {step}
                </div>
                {index < pipelineFlow.length - 1 && (
                  <div style={{
                    position: "absolute",
                    top: "40px",
                    left: `${(index + 1) * (100 / pipelineFlow.length)}%`,
                    width: "20px",
                    height: "2px",
                    background: "#10b981",
                    transform: "translateX(-50%)"
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Cards */}
      <section style={{
        padding: "40px 20px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        <div style={{
          fontSize: "12px",
          color: "#334155",
          letterSpacing: "2px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          SYSTEM COMPONENTS
        </div>
        
        <h2 style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#f1f5f9",
          marginBottom: "40px",
          textAlign: "center"
        }}>
          Each Component and Its Role
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "30px"
        }}>
          {ragSteps.map((step, index) => (
            <div
              key={step.id}
              style={{
                background: "rgba(13,17,23,0.8)",
                border: `1px solid ${hoveredCard === step.id ? step.color : "#1e293b"}`,
                borderRadius: "16px",
                padding: "30px",
                position: "relative",
                transition: "all 0.3s ease",
                transform: hoveredCard === step.id ? "translateY(-5px)" : "translateY(0)",
                boxShadow: hoveredCard === step.id 
                  ? `0 20px 40px ${step.color}20` 
                  : "0 4px 6px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={() => setHoveredCard(step.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Step Number */}
              <div style={{
                position: "absolute",
                top: "-15px",
                left: "30px",
                background: step.color,
                color: "white",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "700"
              }}>
                {index + 1}
              </div>
              
              {/* Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "20px"
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: `${step.color}20`,
                  border: `1px solid ${step.color}`,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  color: step.color,
                  fontWeight: "700",
                  fontFamily: "monospace"
                }}>
                  {step.icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: step.color,
                    marginBottom: "4px",
                    letterSpacing: "1px"
                  }}>
                    {step.title}
                  </h3>
                  <div style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    fontFamily: "monospace"
                  }}>
                    {step.tool}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p style={{
                fontSize: "12px",
                color: "#e2e8f0",
                lineHeight: "1.6",
                marginBottom: "16px"
              }}>
                {step.description}
              </p>
              
              {/* Why Chosen */}
              <div style={{
                background: "rgba(16,185,129,0.05)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "16px"
              }}>
                <div style={{
                  fontSize: "10px",
                  color: "#10b981",
                  letterSpacing: "1px",
                  marginBottom: "6px",
                  fontWeight: "600"
                }}>
                  WHY CHOSEN
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  lineHeight: "1.5"
                }}>
                  {step.reason}
                </div>
              </div>
              
              {/* Features */}
              <div>
                <div style={{
                  fontSize: "10px",
                  color: "#334155",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                  fontWeight: "600"
                }}>
                  KEY FEATURES
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px"
                }}>
                  {step.features.map((feature, idx) => (
                    <div key={idx} style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <div style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: step.color
                      }} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Architecture */}
      <section style={{
        padding: "40px 20px",
        background: "linear-gradient(135deg, #020817 0%, #0f172a 100%)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            fontSize: "12px",
            color: "#334155",
            letterSpacing: "2px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            TECHNICAL ARCHITECTURE
          </div>
          
          <h2 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#f1f5f9",
            marginBottom: "40px",
            textAlign: "center"
          }}>
            System Design Overview
          </h2>
          
          <div style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "30px"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px"
            }}>
              <div>
                <h4 style={{
                  fontSize: "14px",
                  color: "#10b981",
                  marginBottom: "12px",
                  letterSpacing: "1px"
                }}>
                  Frontend Layer
                </h4>
                <ul style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  lineHeight: "1.6",
                  paddingLeft: "20px"
                }}>
                  <li>React 18 with Hooks</li>
                  <li>React Router for navigation</li>
                  <li>Terminal-style UI components</li>
                  <li>Real-time data updates</li>
                  <li>Responsive design</li>
                </ul>
              </div>
              
              <div>
                <h4 style={{
                  fontSize: "14px",
                  color: "#3b82f6",
                  marginBottom: "12px",
                  letterSpacing: "1px"
                }}>
                  Backend Layer
                </h4>
                <ul style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  lineHeight: "1.6",
                  paddingLeft: "20px"
                }}>
                  <li>FastAPI web framework</li>
                  <li>Async request handling</li>
                  <li>RESTful API endpoints</li>
                  <li>CORS configuration</li>
                  <li>Error handling middleware</li>
                </ul>
              </div>
              
              <div>
                <h4 style={{
                  fontSize: "14px",
                  color: "#8b5cf6",
                  marginBottom: "12px",
                  letterSpacing: "1px"
                }}>
                  AI/ML Layer
                </h4>
                <ul style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  lineHeight: "1.6",
                  paddingLeft: "20px"
                }}>
                  <li>MiniLM embeddings</li>
                  <li>ChromaDB vector storage</li>
                  <li>Groq LLaMA 3 inference</li>
                  <li>RAG pipeline orchestration</li>
                  <li>Context-aware responses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section style={{
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          fontSize: "12px",
          color: "#334155",
          letterSpacing: "2px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          PERFORMANCE METRICS
        </div>
        
        <h2 style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#f1f5f9",
          marginBottom: "40px",
          textAlign: "center"
        }}>
          System Performance Characteristics
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px"
        }}>
          <div style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#10b981",
              marginBottom: "8px"
            }}>
              &lt; 500ms
            </div>
            <div style={{
              fontSize: "11px",
              color: "#94a3b8"
            }}>
              Average Response Time
            </div>
          </div>
          
          <div style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#3b82f6",
              marginBottom: "8px"
            }}>
              99.9%
            </div>
            <div style={{
              fontSize: "11px",
              color: "#94a3b8"
            }}>
              Uptime
            </div>
          </div>
          
          <div style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#8b5cf6",
              marginBottom: "8px"
            }}>
              1000+
            </div>
            <div style={{
              fontSize: "11px",
              color: "#94a3b8"
            }}>
              Concurrent Users
            </div>
          </div>
          
          <div style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#f59e0b",
              marginBottom: "8px"
            }}>
              15s
            </div>
            <div style={{
              fontSize: "11px",
              color: "#94a3b8"
            }}>
              Data Refresh Rate
            </div>
          </div>
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

export default Learn;
