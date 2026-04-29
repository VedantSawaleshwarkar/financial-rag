import Spark from "./Spark";

function formatCompactNumber(value) {
  if (value === undefined || value === null) {
    return "--";
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toString();
}

function TickerCard({ name, data, meta, selected, onClick, sparkVals, priceFlash }) {
  const up = (data?.change_pct ?? 0) >= 0;
  const accent = up ? "#34d399" : "#f87171";

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        borderRadius: 20,
        border: selected ? "1px solid rgba(56,189,248,0.45)" : "1px solid rgba(148,163,184,0.12)",
        background: selected
          ? "linear-gradient(180deg, rgba(8,47,73,0.4), rgba(7,16,31,0.95))"
          : "linear-gradient(180deg, rgba(15,23,42,0.76), rgba(5,10,21,0.94))",
        padding: 18,
        cursor: "pointer",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
        color: "#e2e8f0",
        boxShadow: selected ? "0 18px 40px rgba(14,165,233,0.12)" : "none",
      }}
    >
      {priceFlash?.flash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: priceFlash.isUp ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 8,
              }}
            >
              {meta?.venue} | {meta?.code}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc", marginBottom: 6 }}>{meta?.label || name}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#f8fafc", lineHeight: 1.05 }}>
              {data?.price?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "--"}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color: accent,
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {up ? "+" : ""}
              {data?.change_pct?.toFixed(2) || "0.00"}%
            </div>
            <div style={{ opacity: 0.8 }}>
              <Spark vals={sparkVals} up={up} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 10,
            marginTop: 18,
            paddingTop: 16,
            borderTop: "1px solid rgba(148,163,184,0.08)",
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Open</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#cbd5e1" }}>
              {data?.open?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "--"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>High</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#cbd5e1" }}>
              {data?.high?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "--"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Low</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#cbd5e1" }}>
              {data?.low?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "--"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Volume</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#cbd5e1" }}>{formatCompactNumber(data?.volume)}</div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default TickerCard;
