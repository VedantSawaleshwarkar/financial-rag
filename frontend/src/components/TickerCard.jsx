import Spark from "./Spark";

// Ticker card component with OHLC data and price flash animations
function TickerCard({ name, data, meta, selected, onClick, sparkVals, priceFlash }) {
  const up = (data?.change_pct ?? 0) >= 0;
  const col = up ? "#34d399" : "#f87171";
  
  // Format volume
  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <button 
      onClick={onClick} 
      style={{
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
        textAlign: "left",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Price Flash Animation */}
      {priceFlash?.flash && (
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: priceFlash?.isUp ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
            animation: "priceFlash 0.6s ease-out",
            pointerEvents: "none"
          }}
        />
      )}
      
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
        <div style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: selected ? col : "#6b7280",
          marginTop: -2
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: 14, 
            fontWeight: "bold", 
            color: "#f1f5f9", 
            fontFamily: "monospace", 
            marginBottom: 4 
          }}>
            {name}
          </div>
          <div style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: "#f1f5f9", 
            fontFamily: "monospace" 
          }}>
            {data?.price?.toLocaleString("en-IN") || "0.00"}
          </div>
          
          {/* OHLC Data */}
          <div style={{ 
            display: "flex", 
            gap: "12px", 
            fontSize: 10, 
            color: "#64748b", 
            fontFamily: "monospace",
            marginTop: 4
          }}>
            <span>O: {data?.open?.toLocaleString("en-IN") || "0.00"}</span>
            <span>H: {data?.high?.toLocaleString("en-IN") || "0.00"}</span>
            <span>L: {data?.low?.toLocaleString("en-IN") || "0.00"}</span>
          </div>
          
          <div style={{ 
            fontSize: 12, 
            color: "#475569", 
            fontFamily: "monospace", 
            marginTop: 2 
          }}>
            {meta?.sub}
          </div>
          
          {/* Volume */}
          {data?.volume && (
            <div style={{ 
              fontSize: 10, 
              color: "#64748b", 
              fontFamily: "monospace", 
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span style={{ opacity: 0.7 }}>Vol:</span>
              <span>{formatVolume(data.volume)}</span>
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ 
            fontSize: 12, 
            color: col, 
            fontFamily: "monospace", 
            fontWeight: "bold" 
          }}>
            {data?.change_pct >= 0 ? "+" : ""}{data?.change_pct?.toFixed(2)}%
          </div>
          <Spark vals={sparkVals} up={up} />
        </div>
      </div>
    </button>
  );
}

export default TickerCard;
