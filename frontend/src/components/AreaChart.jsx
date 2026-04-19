// Area chart component
function AreaChart({ history }) {
  if (!history.length) return (
    <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#1e293b", fontSize: 12, fontFamily: "monospace" }}>
      START BACKEND
    </div>
  );
  const W = 560, H = 150;
  const vals = history.map(d => d.close);
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const nx = i => (i / (history.length - 1)) * W;
  const ny = v => H - ((v - mn) / (mx - mn || 1)) * (H - 16);
  const pts = vals.map((v, i) => `${nx(i)},${ny(v)}`).join(" ");
  const last = vals[vals.length - 1], first = vals[0];
  const up = last >= first;
  const col = up ? "#34d399" : "#f87171";
  const yLevels = [0.25, 0.5, 0.75].map(f => mn + (mx - mn) * f);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 22}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="af" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.18" />
          <stop offset="100%" stopColor={col} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {yLevels.map((v, i) => (
        <g key={i}>
          <line x1={0} y1={ny(v)} x2={W} y2={ny(v)} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 6" />
          <text x={4} y={ny(v) - 3} fontSize="9" fill="#334155" fontFamily="monospace">{v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</text>
        </g>
      ))}
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#af)" />
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.8" strokeLinejoin="round" />
      <line x1={W - 60} y1={ny(last)} x2={W} y2={ny(last)} stroke={col} strokeWidth="0.5" strokeDasharray="3 3" />
      <rect x={W - 58} y={ny(last) - 9} width={58} height={16} rx={3} fill={col} fillOpacity="0.15" />
      <text x={W - 29} y={ny(last) + 4} textAnchor="middle" fontSize="9" fill={col} fontFamily="monospace" fontWeight="700">{last.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</text>
      {[0, Math.floor(history.length / 2), history.length - 1].map(idx => (
        <text key={idx} x={nx(idx)} y={H + 16} textAnchor="middle" fontSize="9" fill="#334155" fontFamily="monospace">{history[idx]?.date?.slice(5)}</text>
      ))}
    </svg>
  );
}

export default AreaChart;
