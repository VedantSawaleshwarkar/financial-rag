import Spark from "./Spark";

// Ticker card component
function TickerCard({ name, data, meta, selected, onClick, sparkVals }) {
  const up = (data?.change_pct ?? 0) >= 0;
  const col = up ? "#34d399" : "#f87171";
  return (
    <button onClick={onClick} style={{
      background: selected ? "rgba(16,185,129,0.07)" : "rgba(13,17,23,0.9)",
      border: `1px solid ${selected ? "#10b981" : "#1e293b"}`,
      borderRadius: 12,
      padding: 16,
      cursor: "pointer",
      transition: "all 0.15s",
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      textAlign: "left"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
        <div style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: selected ? col : "#6b7280",
          marginTop: -2
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#f1f5f9", fontFamily: "monospace", marginBottom: 4 }}>{name}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", fontFamily: "monospace" }}>{data?.price || "0.00"}</div>
          <div style={{ fontSize: 12, color: "#475569", fontFamily: "monospace", marginTop: 2 }}>{meta?.sub}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: col, fontFamily: "monospace", fontWeight: "bold" }}>
            {data?.change_pct >= 0 ? "+" : ""}{data?.change_pct?.toFixed(2)}%
          </div>
          <Spark vals={sparkVals} up={up} />
        </div>
      </div>
    </button>
  );
}

export default TickerCard;
