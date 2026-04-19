import { useState } from "react";

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: "🤖 AI-Powered Q&A",
      description: "Advanced RAG system that answers complex financial questions using retrieval-augmented generation technology",
      icon: "🤖",
      details: [
        "Natural language processing for financial queries",
        "Context-aware responses using ChromaDB",
        "Real-time market data integration",
        "Support for multiple asset classes"
      ]
    },
    {
      id: 2,
      title: "📊 Real-Time Market Data",
      description: "Live market prices and technical indicators for major financial instruments",
      icon: "📊",
      details: [
        "NIFTY 50 and SENSEX indices",
        "Gold, Silver, and Crude Oil commodities",
        "USD/INR forex rates",
        "Historical price charts",
        "Technical analysis indicators"
      ]
    },
    {
      id: 3,
      title: "📈 Interactive Charts",
      description: "Dynamic visualization tools for technical analysis and trend identification",
      icon: "📈",
      details: [
        "Candlestick charts with OHLC data",
        "Volume analysis with moving averages",
        "Technical indicators (RSI, MACD)",
        "Historical performance comparison",
        "Responsive chart design"
      ]
    },
    {
      id: 4,
      title: "🔔 Smart Alerts",
      description: "Intelligent notification system for market movements and opportunities",
      icon: "🔔",
      details: [
        "Price threshold alerts",
        "Volume spike notifications",
        "Pattern recognition alerts",
        "Economic event reminders",
        "Customizable alert criteria"
      ]
    },
    {
      id: 5,
      title: "📚 Knowledge Base",
      description: "Comprehensive financial database with up-to-date information",
      icon: "📚",
      details: [
        "20+ financial documents indexed",
        "Regular data updates",
        "Multiple source verification",
        "Context-aware retrieval",
        "Continuous learning system"
      ]
    },
    {
      id: 6,
      title: "🔒 Security & Privacy",
      description: "Enterprise-grade security measures to protect your financial data",
      icon: "🔒",
      details: [
        "End-to-end encryption",
        "Secure API authentication",
        "Data anonymization",
        "GDPR compliance",
        "Regular security audits"
      ]
    }
  ];

  return (
    <div style={{ 
      padding: "2rem", 
      maxWidth: "1400px", 
      margin: "0 auto",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "3rem",
        borderRadius: "16px",
        marginBottom: "2rem",
        textAlign: "center"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "700", 
          margin: "0 0 1rem 0"
        }}>
          Features & Capabilities
        </h1>
        <p style={{ 
          fontSize: "1.2rem", 
          opacity: 0.95,
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          Explore the powerful features that make FinAI RAG your trusted financial intelligence platform
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
        gap: "2rem",
        marginBottom: "2rem"
      }}>
        {features.map((feature) => (
          <div
            key={feature.id}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              transition: "all 0.3s ease",
              transform: selectedFeature === feature.id ? "translateY(-5px)" : "translateY(0)",
              boxShadow: selectedFeature === feature.id 
                ? "0 20px 40px rgba(102,126,234,0.2)" 
                : "0 10px 25px rgba(0,0,0,0.1)"
            }}
            onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
          >
            <div style={{ 
              fontSize: "3rem", 
              textAlign: "center", 
              marginBottom: "1rem" 
            }}>
              {feature.icon}
            </div>
            <h3 style={{ 
              color: "#1f2937", 
              marginBottom: "1rem",
              fontSize: "1.3rem"
            }}>
              {feature.title}
            </h3>
            <p style={{ 
              color: "#6b7280", 
              lineHeight: "1.6",
              marginBottom: "1.5rem"
            }}>
              {feature.description}
            </p>
            
            {selectedFeature === feature.id && (
              <div style={{ 
                marginTop: "1.5rem",
                padding: "1.5rem",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0"
              }}>
                <h4 style={{ 
                  color: "#374151", 
                  marginBottom: "1rem",
                  fontSize: "1.1rem"
                }}>
                  Key Capabilities:
                </h4>
                <ul style={{ 
                  color: "#6b7280", 
                  margin: 0,
                  paddingLeft: "1.5rem"
                }}>
                  {feature.details.map((detail, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem" }}>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ 
        background: "white", 
        padding: "2rem", 
        borderRadius: "16px", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        border: "1px solid #e5e7eb",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>
          🚀 Ready to Get Started?
        </h2>
        <p style={{ color: "#4b5563", marginBottom: "2rem" }}>
          Experience the future of financial intelligence with our comprehensive platform
        </p>
        <button
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onClick={() => window.location.href = '/'}
        >
          Try FinAI RAG Now
        </button>
      </div>
    </div>
  );
};

export default Features;
