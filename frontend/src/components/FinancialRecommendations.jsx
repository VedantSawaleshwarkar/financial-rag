import { useState, useEffect } from "react";

function FinancialRecommendations() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/recommendations");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch recommendations");
      }
      
      setRecommendations(data);
    } catch (err) {
      setError(err.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "24px",
          borderRadius: "20px",
          border: "1px solid rgba(148,163,184,0.12)",
          background: "rgba(15,23,42,0.72)",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#94a3b8", fontSize: "13px" }}>Loading recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "24px",
          borderRadius: "20px",
          border: "1px solid rgba(248,113,113,0.24)",
          background: "rgba(127,29,29,0.18)",
          color: "#fca5a5",
          fontSize: "13px",
        }}
      >
        {error}
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div
      style={{
        padding: "28px",
        borderRadius: "24px",
        border: "1px solid rgba(167,139,250,0.2)",
        background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(5,10,21,0.96))",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "#a78bfa", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>
            AI-Powered Analysis
          </div>
          <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 700 }}>
            Personalized Financial Recommendations
          </div>
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            background: "rgba(167,139,250,0.2)",
            border: "1px solid rgba(167,139,250,0.3)",
            color: "#a78bfa",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          {recommendations.overall_score || "N/A"}/10
        </div>
      </div>

      <div style={{ display: "grid", gap: 20 }}>
        {/* Spending Analysis */}
        <div
          style={{
            padding: "20px",
            borderRadius: "18px",
            border: "1px solid rgba(148,163,184,0.12)",
            background: "rgba(2,6,23,0.5)",
          }}
        >
          <div style={{ color: "#38bdf8", fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Spending Analysis
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.7 }}>
            {recommendations.spending_analysis}
          </div>
        </div>

        {/* Investment Recommendations */}
        <div
          style={{
            padding: "20px",
            borderRadius: "18px",
            border: "1px solid rgba(34,197,94,0.15)",
            background: "rgba(6,78,59,0.15)",
          }}
        >
          <div style={{ color: "#22c55e", fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Investment Recommendations
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {recommendations.investment_recommendations && recommendations.investment_recommendations.length > 0 ? (
              recommendations.investment_recommendations.map((rec, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.15)",
                  }}
                >
                  <div style={{ color: "#22c55e", fontSize: 12, marginTop: 1 }}>→</div>
                  <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6 }}>{rec}</div>
                </div>
              ))
            ) : (
              <div style={{ color: "#94a3b8", fontSize: 13 }}>No investment recommendations available</div>
            )}
          </div>
        </div>

        {/* Savings Strategies */}
        <div
          style={{
            padding: "20px",
            borderRadius: "18px",
            border: "1px solid rgba(245,158,11,0.15)",
            background: "rgba(180,83,9,0.15)",
          }}
        >
          <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Savings Strategies
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {recommendations.savings_strategies && recommendations.savings_strategies.length > 0 ? (
              recommendations.savings_strategies.map((strategy, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.15)",
                  }}
                >
                  <div style={{ color: "#f59e0b", fontSize: 12, marginTop: 1 }}>→</div>
                  <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6 }}>{strategy}</div>
                </div>
              ))
            ) : (
              <div style={{ color: "#94a3b8", fontSize: 13 }}>No savings strategies available</div>
            )}
          </div>
        </div>

        {/* Risk Assessment */}
        <div
          style={{
            padding: "20px",
            borderRadius: "18px",
            border: "1px solid rgba(239,68,68,0.15)",
            background: "rgba(185,28,28,0.15)",
          }}
        >
          <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Risk Assessment
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.7 }}>
            {recommendations.risk_assessment}
          </div>
        </div>

        {/* Mode Indicator */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid rgba(148,163,184,0.12)" }}>
          <div style={{ color: "#64748b", fontSize: 11 }}>
            Analysis based on uploaded bank statements and current market data
          </div>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              background: recommendations.mode === "live" ? "rgba(34,197,94,0.2)" : "rgba(148,163,184,0.2)",
              color: recommendations.mode === "live" ? "#22c55e" : "#94a3b8",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {recommendations.mode === "live" ? "Live AI Analysis" : "Demo Mode"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialRecommendations;
