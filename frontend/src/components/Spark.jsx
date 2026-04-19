// Mini sparkline component
function Spark({ vals = [], up }) {
  if (vals.length < 2) return null;
  const W = 72, H = 24;
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const nx = i => (i / (vals.length - 1)) * W;
  const ny = v => H - ((v - mn) / (mx - mn || 1)) * H;
  const pts = vals.map((v, i) => `${nx(i)},${ny(v)}`).join(" ");
  const col = up ? "#34d399" : "#f87171";
  return (
    <svg width={W} height={H} style={{ display: "block", overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default Spark;
