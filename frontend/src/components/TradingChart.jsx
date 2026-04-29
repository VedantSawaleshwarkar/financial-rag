import { useState, useEffect, useRef } from "react";

const TradingChart = ({ history, symbol = "NIFTY 50" }) => {
  const [chartType, setChartType] = useState("candlestick");
  const [timeframe, setTimeframe] = useState("1m");
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const svgRef = useRef(null);

  if (!history || !history.length) {
    return (
      <div style={{ 
        height: 400, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        color: "#1e293b", 
        fontSize: 12, 
        fontFamily: "monospace",
        background: "rgba(13,17,23,0.8)",
        border: "1px solid #0f172a",
        borderRadius: 12
      }}>
        START BACKEND FOR LIVE CHARTS
      </div>
    );
  }

  const W = 800;
  const H = 300;
  const VOLUME_HEIGHT = 60;
  const TOTAL_HEIGHT = H + VOLUME_HEIGHT + 40;

  // Calculate price ranges
  const prices = history.map(d => d.close);
  const highPrices = history.map(d => d.high || d.close);
  const lowPrices = history.map(d => d.low || d.close);
  const volumes = history.map(d => d.volume || 0);
  
  const minPrice = Math.min(...lowPrices);
  const maxPrice = Math.max(...highPrices);
  const maxVolume = Math.max(...volumes);

  const nx = (i) => (i / (history.length - 1)) * W;
  const ny = (v) => H - ((v - minPrice) / (maxPrice - minPrice || 1)) * (H - 20);
  const nvy = (v) => VOLUME_HEIGHT - (v / (maxVolume || 1)) * (VOLUME_HEIGHT - 10);

  // Get price color
  const getPriceColor = (open, close) => {
    return close >= open ? "#10b981" : "#ef4444";
  };

  // Calculate percentage change
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const change = lastPrice - firstPrice;
  const changePercent = ((change / firstPrice) * 100).toFixed(2);

  // Chart controls
  const chartTypes = ["candlestick", "line", "area"];
  const timeframes = ["1m", "5m", "15m", "1h", "1d"];

  return (
    <div style={{
      background: "rgba(13,17,23,0.8)",
      border: "1px solid #0f172a",
      borderRadius: 12,
      padding: 20,
      fontFamily: "'IBM Plex Mono', monospace"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
      }}>
        <div>
          <div style={{ fontSize: 14, color: "#f1f5f9", fontWeight: 600, marginBottom: 4 }}>
            {symbol}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20, color: "#f1f5f9", fontWeight: 700 }}>
              {lastPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            <span style={{
              fontSize: 12,
              color: change >= 0 ? "#10b981" : "#ef4444",
              fontWeight: 600
            }}>
              {change >= 0 ? "+" : ""}{change.toFixed(2)} ({change >= 0 ? "+" : ""}{changePercent}%)
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8 }}>
          {/* Chart Type */}
          <div style={{ display: "flex", gap: 4, background: "rgba(15,23,42,0.5)", borderRadius: 6, padding: 4 }}>
            {chartTypes.map(type => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                style={{
                  padding: "4px 8px",
                  fontSize: 10,
                  color: chartType === type ? "#f1f5f9" : "#64748b",
                  background: chartType === type ? "#10b981" : "transparent",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  textTransform: "uppercase"
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Timeframe */}
          <div style={{ display: "flex", gap: 4, background: "rgba(15,23,42,0.5)", borderRadius: 6, padding: 4 }}>
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: "4px 8px",
                  fontSize: 10,
                  color: timeframe === tf ? "#f1f5f9" : "#64748b",
                  background: timeframe === tf ? "#3b82f6" : "transparent",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <svg 
        ref={svgRef}
        width="100%" 
        viewBox={`0 0 ${W} ${TOTAL_HEIGHT}`} 
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
        onMouseMove={(e) => {
          if (svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (W / rect.width);
            const index = Math.floor((x / W) * history.length);
            if (index >= 0 && index < history.length) {
              setHoveredCandle({ ...history[index], index });
            }
          }
        }}
        onMouseLeave={() => setHoveredCandle(null)}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
          const y = 20 + f * (H - 20);
          const price = minPrice + (maxPrice - minPrice) * (1 - f);
          return (
            <g key={`price-${i}`}>
              <line
                x1={0}
                y1={y}
                x2={W}
                y2={y}
                stroke="#1e293b"
                strokeWidth="0.5"
                strokeDasharray="2 4"
              />
              <text
                x={W + 5}
                y={y + 3}
                fontSize="9"
                fill="#64748b"
                textAnchor="start"
              >
                {price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </text>
            </g>
          );
        })}

        {/* Volume bars */}
        {history.map((data, i) => {
          const volume = data.volume || 0;
          const x = nx(i);
          const barWidth = Math.max(1, (W / history.length) * 0.6);
          const color = data.close >= (data.open || data.close) ? "#10b981" : "#ef4444";
          
          return (
            <rect
              key={`volume-${i}`}
              x={x - barWidth / 2}
              y={H + 40 + nvy(volume)}
              width={barWidth}
              height={VOLUME_HEIGHT - nvy(volume)}
              fill={color}
              opacity={0.3}
            />
          );
        })}

        {/* Price chart */}
        {chartType === "candlestick" && history.map((data, i) => {
          const x = nx(i);
          const barWidth = Math.max(1, (W / history.length) * 0.8);
          const open = data.open || data.close;
          const close = data.close;
          const high = data.high || Math.max(open, close);
          const low = data.low || Math.min(open, close);
          const color = getPriceColor(open, close);

          return (
            <g key={`candle-${i}`}>
              {/* Wick */}
              <line
                x1={x}
                y1={ny(high)}
                x2={x}
                y2={ny(low)}
                stroke={color}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x - barWidth / 2}
                y={ny(Math.max(open, close))}
                width={barWidth}
                height={Math.abs(ny(open) - ny(close))}
                fill={color}
                stroke={color}
              />
            </g>
          );
        })}

        {chartType === "line" && (
          <>
            <polyline
              points={prices.map((price, i) => `${nx(i)},${ny(price)}`).join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </>
        )}

        {chartType === "area" && (
          <>
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <polygon
              points={`0,${H} ${prices.map((price, i) => `${nx(i)},${ny(price)}`).join(" ")} ${W},${H}`}
              fill="url(#areaGradient)"
            />
            <polyline
              points={prices.map((price, i) => `${nx(i)},${ny(price)}`).join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Hover tooltip */}
        {hoveredCandle && (
          <g>
            <rect
              x={nx(hoveredCandle.index) + 10}
              y={10}
              width={120}
              height={80}
              fill="rgba(15,23,42,0.95)"
              stroke="#1e293b"
              strokeWidth="1"
              rx={4}
            />
            <text x={nx(hoveredCandle.index) + 15} y={25} fontSize="9" fill="#94a3b8">
              {hoveredCandle.date || "N/A"}
            </text>
            <text x={nx(hoveredCandle.index) + 15} y={40} fontSize="9" fill="#f1f5f9">
              O: {(hoveredCandle.open || hoveredCandle.close).toFixed(2)}
            </text>
            <text x={nx(hoveredCandle.index) + 15} y={52} fontSize="9" fill="#f1f5f9">
              H: {(hoveredCandle.high || hoveredCandle.close).toFixed(2)}
            </text>
            <text x={nx(hoveredCandle.index) + 15} y={64} fontSize="9" fill="#f1f5f9">
              L: {(hoveredCandle.low || hoveredCandle.close).toFixed(2)}
            </text>
            <text x={nx(hoveredCandle.index) + 15} y={76} fontSize="9" fill="#f1f5f9">
              C: {hoveredCandle.close.toFixed(2)}
            </text>
          </g>
        )}

        {/* Volume label */}
        <text x={0} y={H + 35} fontSize="9" fill="#64748b">
          Volume
        </text>
      </svg>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 16,
        marginTop: 16,
        paddingTop: 16,
        borderTop: "1px solid #1e293b"
      }}>
        <div>
          <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>HIGH</div>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>
            {Math.max(...highPrices).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>LOW</div>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>
            {Math.min(...lowPrices).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>VOLUME</div>
          <div style={{ fontSize: 11, color: "#f1f5f9", fontWeight: 600 }}>
            {volumes[volumes.length - 1]?.toLocaleString("en-IN") || "N/A"}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>CHANGE</div>
          <div style={{ fontSize: 11, color: change >= 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)} ({change >= 0 ? "+" : ""}{changePercent}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
