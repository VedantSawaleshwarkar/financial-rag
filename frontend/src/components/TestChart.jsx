import React from 'react';

const TestChart = ({ history, symbol = "TEST" }) => {
  console.log('TestChart rendered with:', { history, symbol, historyLength: history?.length });

  // Create sample data if no history provided
  const sampleData = history && history.length > 0 ? history : [
    { date: "2026-04-27 09:15:00", open: 19500, high: 19550, low: 19450, close: 19520, volume: 1000000 },
    { date: "2026-04-27 09:16:00", open: 19520, high: 19580, low: 19510, close: 19560, volume: 1200000 },
    { date: "2026-04-27 09:17:00", open: 19560, high: 19600, low: 19540, close: 19580, volume: 900000 },
    { date: "2026-04-27 09:18:00", open: 19580, high: 19590, low: 19520, close: 19530, volume: 1100000 },
    { date: "2026-04-27 09:19:00", open: 19530, high: 19570, low: 19500, close: 19550, volume: 800000 },
  ];

  const data = history && history.length > 0 ? history : sampleData;
  const lastPrice = data[data.length - 1].close;
  const firstPrice = data[0].open;
  const change = lastPrice - firstPrice;
  const changePercent = ((change / firstPrice) * 100).toFixed(2);

  return (
    <div style={{
      background: "rgba(13,17,23,0.8)",
      border: "2px solid #3b82f6",
      borderRadius: 12,
      padding: 20,
      fontFamily: "monospace",
      margin: 20
    }}>
      <div style={{ color: "#f1f5f9", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          📊 {symbol} - TEST CHART
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Data Points: {data.length} | Using: {history && history.length > 0 ? "REAL DATA" : "SAMPLE DATA"}
        </div>
        <div style={{ fontSize: 14, marginBottom: 8 }}>
          Price: {lastPrice.toFixed(2)} 
          <span style={{ color: change >= 0 ? "#10b981" : "#ef4444", marginLeft: 8 }}>
            ({change >= 0 ? "+" : ""}{change.toFixed(2)} / {change >= 0 ? "+" : ""}{changePercent}%)
          </span>
        </div>
      </div>

      {/* Simple SVG Chart */}
      <svg width="100%" height="200" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid #1e293b", borderRadius: 8 }}>
        {/* Grid */}
        {[0, 50, 100, 150, 200].map((y, i) => (
          <line
            key={`grid-${i}`}
            x1="0"
            y1={y}
            x2="800"
            y2={y}
            stroke="#1e293b"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        ))}

        {/* Candlesticks */}
        {data.map((candle, i) => {
          const x = (i / (data.length - 1)) * 760 + 20;
          const candleHeight = 10;
          const y = 100 - candleHeight / 2;
          const isGreen = candle.close >= candle.open;
          const color = isGreen ? "#10b981" : "#ef4444";

          return (
            <g key={`candle-${i}`}>
              {/* Wick */}
              <line
                x1={x}
                y1={y - 15}
                x2={x}
                y2={y + 15}
                stroke={color}
                strokeWidth="2"
              />
              {/* Body */}
              <rect
                x={x - 8}
                y={y - candleHeight / 2}
                width={16}
                height={candleHeight}
                fill={color}
                stroke={color}
              />
              {/* Date label */}
              <text
                x={x}
                y={190}
                fontSize="8"
                fill="#64748b"
                textAnchor="middle"
              >
                {candle.date ? candle.date.slice(11, 16) : `${i + 1}`}
              </text>
            </g>
          );
        })}

        {/* Title */}
        <text x="400" y="20" fontSize="12" fill="#f1f5f9" textAnchor="middle" fontWeight="bold">
          CANDLESTICK CHART TEST
        </text>
      </svg>

      {/* Data Table */}
      <div style={{ marginTop: 16, fontSize: 10, color: "#64748b" }}>
        <div style={{ fontWeight: "bold", marginBottom: 8, color: "#f1f5f9" }}>Sample Data:</div>
        {data.slice(0, 3).map((candle, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            {candle.date?.slice(11, 16)} - O:{candle.open} H:{candle.high} L:{candle.low} C:{candle.close}
          </div>
        ))}
        {data.length > 3 && <div>... and {data.length - 3} more</div>}
      </div>
    </div>
  );
};

export default TestChart;
