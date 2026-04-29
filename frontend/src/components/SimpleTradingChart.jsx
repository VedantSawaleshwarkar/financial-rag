import { useState, useRef } from "react";

const SimpleTradingChart = ({ history, symbol = "NIFTY 50" }) => {
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const svgRef = useRef(null);

  // Debug: Log the history data
  console.log('SimpleTradingChart - history:', history);
  console.log('SimpleTradingChart - history length:', history?.length);

  if (!history || !history.length) {
    console.log('No history data, showing placeholder');
    return (
      <div style={{ 
        height: 400, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        color: "#f1f5f9", 
        fontSize: 14, 
        fontFamily: "monospace",
        background: "rgba(13,17,23,0.8)",
        border: "1px solid #0f172a",
        borderRadius: 12
      }}>
        <div>
          <div>Loading chart data...</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
            {history ? 'History exists but empty' : 'No history data available'}
          </div>
        </div>
      </div>
    );
  }

  const W = 800;
  const H = 300;

  // Calculate price ranges
  const prices = history.map(d => d.close);
  const highPrices = history.map(d => d.high || d.close);
  const lowPrices = history.map(d => d.low || d.close);
  
  const minPrice = Math.min(...lowPrices);
  const maxPrice = Math.max(...highPrices);

  console.log('Price range:', { minPrice, maxPrice, prices: prices.slice(0, 5) });

  const nx = (i) => (i / (history.length - 1)) * W;
  const ny = (v) => H - ((v - minPrice) / (maxPrice - minPrice || 1)) * (H - 20);

  // Get price color
  const getPriceColor = (open, close) => {
    return close >= open ? "#10b981" : "#ef4444";
  };

  // Calculate percentage change
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const change = lastPrice - firstPrice;
  const changePercent = ((change / firstPrice) * 100).toFixed(2);

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
          <div style={{ fontSize: 16, color: "#f1f5f9", fontWeight: 600, marginBottom: 4 }}>
            {symbol}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24, color: "#f1f5f9", fontWeight: 700 }}>
              {lastPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            <span style={{
              fontSize: 14,
              color: change >= 0 ? "#10b981" : "#ef4444",
              fontWeight: 600
            }}>
              {change >= 0 ? "+" : ""}{change.toFixed(2)} ({change >= 0 ? "+" : ""}{changePercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <svg 
        ref={svgRef}
        width="100%" 
        viewBox={`0 0 ${W} ${H + 40}`} 
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

        {/* Candlestick chart */}
        {history.map((data, i) => {
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

        {/* Hover tooltip */}
        {hoveredCandle && (
          <g>
            <rect
              x={Math.min(nx(hoveredCandle.index) + 10, W - 130)}
              y={10}
              width={120}
              height={80}
              fill="rgba(15,23,42,0.95)"
              stroke="#1e293b"
              strokeWidth="1"
              rx={4}
            />
            <text x={Math.min(nx(hoveredCandle.index) + 15, W - 115)} y={25} fontSize="9" fill="#94a3b8">
              {hoveredCandle.date ? hoveredCandle.date.slice(11, 16) : "N/A"}
            </text>
            <text x={Math.min(nx(hoveredCandle.index) + 15, W - 115)} y={40} fontSize="9" fill="#f1f5f9">
              O: {(hoveredCandle.open || hoveredCandle.close).toFixed(2)}
            </text>
            <text x={Math.min(nx(hoveredCandle.index) + 15, W - 115)} y={52} fontSize="9" fill="#f1f5f9">
              H: {(hoveredCandle.high || hoveredCandle.close).toFixed(2)}
            </text>
            <text x={Math.min(nx(hoveredCandle.index) + 15, W - 115)} y={64} fontSize="9" fill="#f1f5f9">
              L: {(hoveredCandle.low || hoveredCandle.close).toFixed(2)}
            </text>
            <text x={Math.min(nx(hoveredCandle.index) + 15, W - 115)} y={76} fontSize="9" fill="#f1f5f9">
              C: {hoveredCandle.close.toFixed(2)}
            </text>
          </g>
        )}
      </svg>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 16,
        marginTop: 16,
        paddingTop: 16,
        borderTop: "1px solid #1e293b"
      }}>
        <div>
          <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>DAY HIGH</div>
          <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>
            {Math.max(...highPrices).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>DAY LOW</div>
          <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>
            {Math.min(...lowPrices).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>CHANGE</div>
          <div style={{ fontSize: 12, color: change >= 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)} ({change >= 0 ? "+" : ""}{changePercent}%)
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>DATA POINTS</div>
          <div style={{ fontSize: 12, color: "#f1f5f9", fontWeight: 600 }}>
            {history.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTradingChart;
