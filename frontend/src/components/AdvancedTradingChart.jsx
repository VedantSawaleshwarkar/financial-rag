import { useMemo, useState } from "react";

const chartTypes = [
  { key: "candlestick", label: "Candles" },
  { key: "line", label: "Line" },
  { key: "area", label: "Area" },
];

function ControlPill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: active ? "1px solid rgba(56,189,248,0.45)" : "1px solid rgba(148,163,184,0.14)",
        background: active ? "rgba(56,189,248,0.12)" : "rgba(2,6,23,0.48)",
        color: active ? "#e0f2fe" : "#94a3b8",
        borderRadius: 999,
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: 11,
        fontFamily: "inherit",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </button>
  );
}

function AdvancedTradingChart({ history, symbol = "NIFTY 50" }) {
  const [chartType, setChartType] = useState("candlestick");

  const series = useMemo(() => (Array.isArray(history) ? history.filter(Boolean) : []), [history]);

  if (!series.length) {
    return (
      <div
        style={{
          minHeight: 420,
          borderRadius: 20,
          border: "1px dashed rgba(148,163,184,0.22)",
          background: "rgba(2,6,23,0.45)",
          display: "grid",
          placeItems: "center",
          color: "#94a3b8",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 18, color: "#e2e8f0", marginBottom: 10 }}>{symbol}</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>Waiting for intraday history to load from the backend.</div>
        </div>
      </div>
    );
  }

  const prices = series.map((point) => point.close);
  const highs = series.map((point) => point.high ?? point.close);
  const lows = series.map((point) => point.low ?? point.close);
  const volumes = series.map((point) => point.volume ?? 0);

  const firstPrice = series[0]?.open ?? prices[0];
  const lastPrice = prices[prices.length - 1];
  const change = lastPrice - firstPrice;
  const changePct = firstPrice ? (change / firstPrice) * 100 : 0;
  const maxPrice = Math.max(...highs);
  const minPrice = Math.min(...lows);
  const maxVolume = Math.max(...volumes, 1);

  const W = 940;
  const H = 360;
  const volumeHeight = 70;
  const footerGap = 40;
  const totalHeight = H + volumeHeight + footerGap;
  const chartBottom = H - 16;
  const candleWidth = Math.max(2, (W / Math.max(series.length, 1)) * 0.55);

  const xAt = (index) => (index / Math.max(series.length - 1, 1)) * (W - 30) + 12;
  const yAt = (value) => chartBottom - ((value - minPrice) / Math.max(maxPrice - minPrice, 1)) * (H - 52);
  const volumeY = (value) => H + 20 + (volumeHeight - (value / maxVolume) * (volumeHeight - 14));

  const linePoints = prices.map((value, index) => `${xAt(index)},${yAt(value)}`).join(" ");
  const areaPoints = `12,${chartBottom} ${linePoints} ${W - 18},${chartBottom}`;

  const latest = series[series.length - 1];
  const highValue = Math.max(...highs).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  const lowValue = Math.min(...lows).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  const volumeValue = (latest?.volume ?? 0).toLocaleString("en-IN");

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", letterSpacing: "0.14em", textTransform: "uppercase" }}>{symbol}</div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 34, fontWeight: 700, color: "#f8fafc" }}>
              {lastPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: 15, color: change >= 0 ? "#34d399" : "#f87171", fontWeight: 700 }}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)} ({change >= 0 ? "+" : ""}
              {changePct.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {chartTypes.map((type) => (
            <ControlPill key={type.key} active={chartType === type.key} onClick={() => setChartType(type.key)}>
              {type.label}
            </ControlPill>
          ))}
        </div>
      </div>

      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(148,163,184,0.1)",
          background: "linear-gradient(180deg, rgba(2,6,23,0.38), rgba(2,6,23,0.72))",
          padding: 18,
        }}
      >
        <svg width="100%" viewBox={`0 0 ${W} ${totalHeight}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = 18 + fraction * (H - 40);
            const price = maxPrice - fraction * (maxPrice - minPrice);
            return (
              <g key={fraction}>
                <line x1="0" y1={y} x2={W} y2={y} stroke="rgba(148,163,184,0.12)" strokeDasharray="4 8" />
                <text x={W - 4} y={y - 4} textAnchor="end" fontSize="10" fill="#64748b">
                  {price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </text>
              </g>
            );
          })}

          {volumes.map((volume, index) => {
            const point = series[index];
            const barColor = (point.close ?? 0) >= (point.open ?? point.close ?? 0) ? "rgba(52,211,153,0.45)" : "rgba(248,113,113,0.45)";
            const x = xAt(index) - candleWidth / 2;
            const y = volumeY(volume);
            return <rect key={`volume-${index}`} x={x} y={y} width={candleWidth} height={H + volumeHeight - y + 4} fill={barColor} rx="2" />;
          })}

          {chartType === "candlestick" &&
            series.map((point, index) => {
              const open = point.open ?? point.close;
              const close = point.close;
              const high = point.high ?? Math.max(open, close);
              const low = point.low ?? Math.min(open, close);
              const color = close >= open ? "#34d399" : "#f87171";
              const x = xAt(index);
              const bodyY = yAt(Math.max(open, close));
              const bodyHeight = Math.max(2, Math.abs(yAt(open) - yAt(close)));

              return (
                <g key={`candle-${index}`}>
                  <line x1={x} y1={yAt(high)} x2={x} y2={yAt(low)} stroke={color} strokeWidth="1.4" />
                  <rect x={x - candleWidth / 2} y={bodyY} width={candleWidth} height={bodyHeight} fill={color} rx="2" />
                </g>
              );
            })}

          {chartType === "line" && <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}

          {chartType === "area" && (
            <>
              <defs>
                <linearGradient id="dashboard-area" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <polygon points={areaPoints} fill="url(#dashboard-area)" />
              <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            </>
          )}

          {series
            .filter((_, index) => index % Math.max(Math.floor(series.length / 6), 1) === 0)
            .map((point, index) => {
              const actualIndex = Math.min(index * Math.max(Math.floor(series.length / 6), 1), series.length - 1);
              const label = point.date ? point.date.slice(11, 16) : `${actualIndex + 1}`;
              return (
                <text key={`${label}-${actualIndex}`} x={xAt(actualIndex)} y={totalHeight - 6} textAnchor="middle" fontSize="10" fill="#64748b">
                  {label}
                </text>
              );
            })}
        </svg>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginTop: 14,
        }}
      >
        <div style={{ padding: "14px 16px", borderRadius: 16, background: "rgba(2,6,23,0.46)", border: "1px solid rgba(148,163,184,0.08)" }}>
          <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Day High</div>
          <div style={{ marginTop: 8, color: "#f8fafc", fontWeight: 700 }}>{highValue}</div>
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 16, background: "rgba(2,6,23,0.46)", border: "1px solid rgba(148,163,184,0.08)" }}>
          <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Day Low</div>
          <div style={{ marginTop: 8, color: "#f8fafc", fontWeight: 700 }}>{lowValue}</div>
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 16, background: "rgba(2,6,23,0.46)", border: "1px solid rgba(148,163,184,0.08)" }}>
          <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Last Volume</div>
          <div style={{ marginTop: 8, color: "#f8fafc", fontWeight: 700 }}>{volumeValue}</div>
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 16, background: "rgba(2,6,23,0.46)", border: "1px solid rgba(148,163,184,0.08)" }}>
          <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Session Open</div>
          <div style={{ marginTop: 8, color: "#f8fafc", fontWeight: 700 }}>
            {(series[0]?.open ?? lastPrice).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedTradingChart;
