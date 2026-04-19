import { useState, useEffect } from "react";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("endpoints");

  const apiEndpoints = [
    {
      method: "GET",
      path: "/market",
      description: "Get current market prices for all supported assets",
      response: "JSON object with price data and change percentages",
      example: '{ "NIFTY50": {"price": 19750.25, "change_pct": 0.85} }'
    },
    {
      method: "GET", 
      path: "/symbols",
      description: "Get list of all available trading symbols",
      response: "JSON object mapping asset names to ticker symbols",
      example: '{ "NIFTY50": "^NSEI", "GOLD": "GC=F" }'
    },
    {
      method: "GET",
      path: "/history/{symbol}",
      description: "Get historical price data for a specific symbol",
      response: "Array of objects with date and close price",
      example: '[{"date": "2026-04-01", "close": 19500.00}]'
    },
    {
      method: "GET",
      path: "/test",
      description: "Health check endpoint to verify API connectivity",
      response: "JSON object with status and message",
      example: '{ "status": "ok", "message": "Backend is working" }'
    },
    {
      method: "POST",
      path: "/ask",
      description: "Ask financial questions using RAG system",
      response: "JSON object with AI-generated answer and sources",
      example: '{ "answer": "Detailed financial analysis...", "sources": ["source1", "source2"] }'
    }
  ];

  const sections = [
    {
      id: "endpoints",
      title: "API Endpoints",
      icon: "🔗"
    },
    {
      id: "authentication",
      title: "Authentication",
      icon: "🔐"
    },
    {
      id: "examples",
      title: "Code Examples",
      icon: "💻"
    },
    {
      id: "errors",
      title: "Error Handling",
      icon: "⚠️"
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
          API Documentation
        </h1>
        <p style={{ 
          fontSize: "1.2rem", 
          opacity: 0.95,
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          Complete API reference for the Financial RAG System
        </p>
      </div>

      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        marginBottom: "2rem",
        flexWrap: "wrap"
      }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            style={{
              background: activeSection === section.id ? "#667eea" : "#f3f4f6",
              color: activeSection === section.id ? "white" : "#1f2937",
              border: "1px solid #e5e7eb",
              padding: "1rem 2rem",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontWeight: "500",
              fontSize: "1rem"
            }}
          >
            <span style={{ marginRight: "0.5rem" }}>{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {activeSection === "endpoints" && (
        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "2rem" }}>API Endpoints</h2>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} style={{ 
                padding: "1.5rem", 
                background: "#f9fafb", 
                borderRadius: "8px",
                border: "1px solid #e2e8f0"
              }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "1rem"
                }}>
                  <h3 style={{ color: "#1f2937", fontSize: "1.2rem" }}>
                    {endpoint.method} {endpoint.path}
                  </h3>
                  <span style={{ 
                    background: "#10b981", 
                    color: "white", 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "4px",
                    fontSize: "0.8rem"
                  }}>
                    {endpoint.method}
                  </span>
                </div>
                <p style={{ color: "#4b5563", lineHeight: "1.6" }}>
                  {endpoint.description}
                </p>
                <div style={{ 
                  background: "#1f2937", 
                  color: "white", 
                  padding: "1rem", 
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem"
                }}>
                  {endpoint.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "authentication" && (
        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "2rem" }}>Authentication</h2>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div style={{ 
              padding: "1.5rem", 
              background: "#fef2f2", 
              borderRadius: "8px",
              border: "1px solid #fecaca"
            }}>
              <h3 style={{ color: "#dc2626", marginBottom: "1rem" }}>🔐 API Key Required</h3>
              <p style={{ color: "#7f1d1d", lineHeight: "1.6" }}>
                Some endpoints may require authentication for access. Include your API key in the request headers:
              </p>
              <div style={{ 
                background: "#1f2937", 
                color: "white", 
                padding: "1rem", 
                borderRadius: "6px",
                fontFamily: "monospace",
                fontSize: "0.9rem"
              }}>
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>
            <div style={{ 
              padding: "1.5rem", 
              background: "#f0fdf4", 
              borderRadius: "8px",
              border: "1px solid #bbf7d0"
            }}>
              <h3 style={{ color: "#059669", marginBottom: "1rem" }}>🔒 Rate Limiting</h3>
              <p style={{ color: "#064e3b", lineHeight: "1.6" }}>
                API requests are limited to prevent abuse. Current limits:
              </p>
              <ul style={{ color: "#064e3b", marginLeft: "1rem" }}>
                <li>100 requests per minute</li>
                <li>1000 requests per hour</li>
                <li>10,000 requests per day</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSection === "examples" && (
        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "2rem" }}>Code Examples</h2>
          
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#374151", marginBottom: "1rem" }}>JavaScript/Fetch</h3>
            <div style={{ 
              background: "#1f2937", 
              color: "white", 
              padding: "1rem", 
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              overflowX: "auto"
            }}>
{`// Get market data
const response = await fetch('http://localhost:8001/market');
const data = await response.json();
console.log(data);

// Ask financial question
const answerResponse = await fetch('http://localhost:8001/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'What is the current market trend?'
  })
});
const answer = await answerResponse.json();`}
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#374151", marginBottom: "1rem" }}>Python/Requests</h3>
            <div style={{ 
              background: "#1f2937", 
              color: "white", 
              padding: "1rem", 
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              overflowX: "auto"
            }}>
{`import requests

# Get market data
response = requests.get('http://localhost:8001/market')
data = response.json()
print(data)

# Ask financial question
answer = requests.post('http://localhost:8001/ask', 
    json={'question': 'What is the current market trend?'}
)
result = answer.json()
print(result)`}
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#374151", marginBottom: "1rem" }}>cURL</h3>
            <div style={{ 
              background: "#1f2937", 
              color: "white", 
              padding: "1rem", 
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              overflowX: "auto"
            }}>
{`# Get market data
curl -X GET http://localhost:8001/market

# Ask financial question
curl -X POST http://localhost:8001/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the current market trend?"}'`}
            </div>
          </div>
        </div>
      )}

      {activeSection === "errors" && (
        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "12px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ color: "#1f2937", marginBottom: "2rem" }}>Error Handling</h2>
          
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div style={{ 
              padding: "1.5rem", 
              background: "#fef2f2", 
              borderRadius: "8px",
              border: "1px solid #fecaca"
            }}>
              <h3 style={{ color: "#dc2626", marginBottom: "1rem" }}>🚫 HTTP Status Codes</h3>
              <div style={{ color: "#7f1d1d", lineHeight: "1.6" }}>
                <p><strong>200 OK:</strong> Request successful</p>
                <p><strong>400 Bad Request:</strong> Invalid request format</p>
                <p><strong>401 Unauthorized:</strong> Authentication required</p>
                <p><strong>429 Too Many Requests:</strong> Rate limit exceeded</p>
                <p><strong>500 Internal Server Error:</strong> Server error occurred</p>
              </div>
            </div>
            
            <div style={{ 
              padding: "1.5rem", 
              background: "#fef2f2", 
              borderRadius: "8px",
              border: "1px solid #fecaca"
            }}>
              <h3 style={{ color: "#dc2626", marginBottom: "1rem" }}>⚠️ Common Errors</h3>
              <div style={{ color: "#7f1d1d", lineHeight: "1.6" }}>
                <p><strong>CORS Error:</strong> Check if frontend URL is allowed</p>
                <p><strong>Network Timeout:</strong> Server may be overloaded</p>
                <p><strong>Invalid JSON:</strong> Check request body format</p>
                <p><strong>Missing Fields:</strong> Ensure all required fields are present</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentation;
