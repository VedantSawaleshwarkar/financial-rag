import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Navigation";
import About from "./About";
import Features from "./Features";
import Documentation from "./Documentation";

const API = "http://localhost:8001";

const TICKER_META = {
  NIFTY50:   { label: "NIFTY 50",  code: "N50",  sub: "NSE" },
  SENSEX:    { label: "SENSEX",    code: "SNX",  sub: "BSE" },
  GOLD:      { label: "GOLD",      code: "XAU",  sub: "MCX" },
  CRUDE_OIL: { label: "CRUDE OIL", code: "CL",   sub: "WTI" },
  USD_INR:   { label: "USD / INR", code: "FX",   sub: "FOREX" },
  SILVER:    { label: "SILVER",    code: "XAG",  sub: "MCX" },
};

const QUICK_QS = [
  "Is it a good time to buy gold?",
  "How is Nifty 50 performing?",
  "What is RBI current repo rate?",
  "Should I invest in crude oil?",
  "Best SIP strategy for 2025?",
  "How do FII flows affect Nifty?",
];

const INDICATORS = [
  { label: "RBI Repo Rate",  value: "6.50%",      note: "Unchanged · Apr 2025" },
  { label: "India GDP FY26", value: "7.2%",        note: "IMF projection" },
  { label: "CPI Inflation",  value: "4.8%",        note: "Within 2–6% target" },
  { label: "Nifty P/E",      value: "23.4x",       note: "Slightly elevated" },
  { label: "FII Flow MTD",   value: "+₹2,840 Cr", note: "Net inflow" },
  { label: "INR / USD",      value: "₹83.47",      note: "Stable range" },
];

// ── Mini sparkline ──
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

// ── Area chart ──
function AreaChart({ history }) {
  if (!history.length) return (
    <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#1e293b", fontSize: 12, fontFamily: "monospace" }}>
      START BACKEND — uvicorn main:app --reload
    </div>
  );
  const W = 560, H = 150;
  const vals = history.map(d => d.close);
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const nx = i => (i / (vals.length - 1 || 1)) * W;
  const ny = v => H - ((v - mn) / (mx - mn || 1)) * (H - 16) - 8;
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
      <text x={W - 29} y={ny(last) + 4} textAnchor="middle" fontSize="9" fill={col} fontFamily="monospace" fontWeight="700">
        {last.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
      </text>
      {[0, Math.floor(history.length / 2), history.length - 1].map(idx => (
        <text key={idx} x={nx(idx)} y={H + 16} textAnchor="middle" fontSize="9" fill="#334155" fontFamily="monospace">
          {history[idx]?.date?.slice(5)}
        </text>
      ))}
    </svg>
  );
}

// ── Ticker card ──
function TickerCard({ name, data, meta, selected, onClick, sparkVals }) {
  const up = (data?.change_pct ?? 0) >= 0;
  const col = up ? "#34d399" : "#f87171";
  return (
    <button onClick={onClick} style={{
      background: selected ? "rgba(16,185,129,0.07)" : "rgba(13,17,23,0.9)",
      border: `1px solid ${selected ? "#10b981" : "#1e293b"}`,
      borderRadius: 10, padding: "12px 14px", cursor: "pointer",
      textAlign: "left", flex: "1 1 140px", transition: "all 0.18s",
      position: "relative", overflow: "hidden",
    }}>
      {selected && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: "#10b981" }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 9, color: "#475569", letterSpacing: 1.5, fontFamily: "monospace", marginBottom: 2 }}>{meta.sub}</div>
          <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", fontWeight: 600 }}>{meta.label}</div>
        </div>
        <span style={{ background: "rgba(13,17,23,0.9)", border: "1px solid #1e293b", borderRadius: 4, padding: "2px 5px", fontSize: 9, color: "#475569", fontFamily: "monospace" }}>{meta.code}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", fontFamily: "monospace", letterSpacing: -0.5, marginBottom: 4 }}>
        {data ? data.price.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "—"}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 11, color: col, fontFamily: "monospace", fontWeight: 600 }}>
          {data ? `${up ? "▲" : "▼"} ${Math.abs(data.change_pct).toFixed(2)}%` : ""}
        </div>
        <Spark vals={sparkVals} up={up} />
      </div>
    </button>
  );
}

// ── Chat bubble ──
function Bubble({ msg }) {
  const isUser = msg.role === "user";
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12, gap: 8 }}>
      {!isUser && (
        <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: "linear-gradient(135deg,#0f766e,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>AI</div>
      )}
      <div style={{
        maxWidth: "82%",
        background: isUser ? "linear-gradient(135deg,#1d4ed8,#1e40af)" : "rgba(30,41,59,0.9)",
        border: isUser ? "none" : "1px solid #1e293b",
        color: "#e2e8f0",
        borderRadius: isUser ? "14px 14px 3px 14px" : "3px 14px 14px 14px",
        padding: "10px 13px", fontSize: 13, lineHeight: 1.65,
      }}>
        {msg.content}
        {msg.context && (
          <div style={{ marginTop: 8 }}>
            <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", color: "#334155", fontSize: 10, cursor: "pointer", fontFamily: "monospace", letterSpacing: 0.5, padding: 0 }}>
              {open ? "▼" : "▶"} RAG SOURCES USED
            </button>
            {open && (
              <div style={{ color: "#475569", fontSize: 11, marginTop: 5, whiteSpace: "pre-wrap", fontFamily: "monospace", lineHeight: 1.8, borderLeft: "2px solid #1e293b", paddingLeft: 8 }}>
                {msg.context}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── News ticker ──
const NEWS = [
  "RBI REPO RATE HELD AT 6.5% · 4TH CONSECUTIVE PAUSE",
  "NIFTY 50 CROSSES 25,000 · IT & BANKING LEAD RALLY",
  "GOLD HITS ₹72,500 PER 10G · GLOBAL UNCERTAINTY DRIVES DEMAND",
  "SEBI NEW F&O MARGIN RULES EFFECTIVE OCT 2025",
  "INDIA GDP REVISED TO 7.4% · IMF APRIL 2025 REPORT",
  "OPEC+ EXTENDS SUPPLY CUTS · CRUDE BELOW $75/BARREL",
  "FII NET INFLOW ₹2,840 CR MTD · EQUITY MARKETS POSITIVE",
];

export default function App() {
  const [market, setMarket]   = useState({});
  const [history, setHistory] = useState([]);
  const [activeTk, setActiveTk] = useState("NIFTY50");
  const [activeChart, setActiveChart] = useState("NSEI");
  const [messages, setMessages] = useState([{
    role: "ai",
    content: "Namaste! I'm your RAG-powered financial advisor for Indian markets.\n\nAsk me anything about Nifty, gold, crude oil, RBI policy, or SIP strategies. My answers come from a real-time knowledge base — not AI guesswork.",
    context: "",
  }]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline]   = useState(false);
  const [tab, setTab]         = useState("chat");
  const chatEndRef = useRef(null);

  const [sparkData] = useState(() => {
    const d = {};
    Object.keys(TICKER_META).forEach(k => {
      const base = k === "NIFTY50" ? 24000 : k === "SENSEX" ? 80000 : k === "GOLD" ? 72000 : k === "SILVER" ? 88000 : k === "CRUDE_OIL" ? 6300 : 83;
      d[k] = Array.from({ length: 20 }, (_, i) => base + (Math.random() - 0.5) * base * 0.015 * (i + 1));
    });
    return d;
  });

  useEffect(() => { fetchMarket(); const iv = setInterval(fetchMarket, 60000); return () => clearInterval(iv); }, []);
  useEffect(() => { fetchHistory(activeChart); }, [activeChart]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function fetchMarket() {
    try {
      console.log("Testing connectivity to:", `${API}/test`);
      const r = await fetch(`${API}/test`);
      console.log("Response status:", r.status);
      console.log("Response ok:", r.ok);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      console.log("Test endpoint response:", data);
      
      // Now try the market endpoint
      console.log("Fetching market data from:", `${API}/market`);
      const marketR = await fetch(`${API}/market`);
      console.log("Market response status:", marketR.status);
      console.log("Market response ok:", marketR.ok);
      if (!marketR.ok) throw new Error(`HTTP ${marketR.status}`);
      const marketData = await marketR.json();
      console.log("Parsed market data:", marketData);
      setMarket(marketData);
      setOnline(true);
      console.log("Market data fetched successfully:", marketData);
    } catch (error) {
      console.error("Failed to fetch data - full error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      setOnline(false);
    }
  }

  async function fetchHistory(sym) {
    try {
      const r = await fetch(`${API}/history/${sym}`);
      setHistory(await r.json());
    } catch { setHistory([]); }
  }

  async function sendQ(q) {
    const question = (q || input).trim();
    if (!question || loading) return;
    setInput("");
    setMessages(p => [...p, { role: "user", content: question, context: "" }]);
    setLoading(true);
    try {
      const r = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const d = await r.json();
      setMessages(p => [...p, { role: "ai", content: d.answer, context: d.context_used }]);
    } catch {
      setMessages(p => [...p, { role: "ai", content: "⚠️ Cannot reach backend. Make sure uvicorn is running on port 8000.", context: "" }]);
    }
    setLoading(false);
  }

  const chartOptions = [
    { key: "NSEI", label: "NIFTY 50" },
    { key: "BSESN", label: "SENSEX" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#020817", color: "#e2e8f0", fontFamily: "'IBM Plex Mono','Courier New',monospace", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "rgba(2,8,23,0.98)", borderBottom: "1px solid #0f172a", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", letterSpacing: 3 }}><span style={{ color: "#10b981" }}>◈</span> FIN<span style={{ color: "#10b981" }}>AI</span></div>
            <div style={{ fontSize: 8, color: "#334155", letterSpacing: 2 }}>RAG TERMINAL · INDIA</div>
          </div>
          <div style={{ width: 1, height: 28, background: "#0f172a" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {chartOptions.map(o => (
              <button key={o.key} onClick={() => { setActiveChart(o.key); setActiveTk(o.key === "NSEI" ? "NIFTY50" : "SENSEX"); }}
                style={{ background: activeChart === o.key ? "rgba(16,185,129,0.1)" : "transparent", border: `1px solid ${activeChart === o.key ? "#10b981" : "#1e293b"}`, color: activeChart === o.key ? "#10b981" : "#475569", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 10, letterSpacing: 1, fontFamily: "monospace", transition: "all 0.15s" }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right", fontSize: 10, color: "#334155", fontFamily: "monospace" }}>
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: online ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${online ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: 20, padding: "3px 10px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: online ? "#10b981" : "#ef4444" }} />
            <span style={{ fontSize: 9, color: online ? "#10b981" : "#ef4444", letterSpacing: 1 }}>{online ? "LIVE" : "OFFLINE"}</span>
          </div>
        </div>
      </header>

      {/* News ticker */}
      <div style={{ overflow: "hidden", whiteSpace: "nowrap", padding: "5px 0", borderBottom: "1px solid #0f172a", background: "rgba(2,8,23,0.7)" }}>
        <div style={{ display: "inline-block", animation: "marquee 35s linear infinite" }}>
          {[...NEWS, ...NEWS].map((n, i) => (
            <span key={i} style={{ marginRight: 60, fontSize: 10, fontFamily: "monospace", color: "#334155" }}>
              <span style={{ color: "#10b981", marginRight: 8 }}>◈</span>{n}
            </span>
          ))}
        </div>
      </div>

      {/* Tickers */}
      <div style={{ display: "flex", gap: 8, padding: "10px 20px", overflowX: "auto", background: "rgba(2,8,23,0.5)" }}>
        {Object.entries(TICKER_META).map(([key, meta]) => (
          <TickerCard key={key} name={key} data={market[key]} meta={meta}
            selected={activeTk === key} sparkVals={sparkData[key]}
            onClick={() => setActiveTk(key)} />
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", flex: 1, overflow: "hidden" }}>

        {/* Left — chart + indicators */}
        <div style={{ padding: "14px 10px 14px 20px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>

          <div style={{ background: "rgba(13,17,23,0.8)", border: "1px solid #0f172a", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace", fontWeight: 700 }}>
                {chartOptions.find(o => o.key === activeChart)?.label} &nbsp;
                <span style={{ fontSize: 9, color: "#1e293b" }}>1M DAILY</span>
              </span>
              {market[activeTk] && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", fontFamily: "monospace" }}>
                    {market[activeTk].price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: market[activeTk].change_pct >= 0 ? "#34d399" : "#f87171" }}>
                    {market[activeTk].change_pct >= 0 ? "▲" : "▼"} {Math.abs(market[activeTk].change_pct).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
            <AreaChart history={history} />
          </div>

          {/* Indicators */}
          <div style={{ background: "rgba(13,17,23,0.8)", border: "1px solid #0f172a", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 9, color: "#334155", letterSpacing: 2, marginBottom: 12, fontFamily: "monospace" }}>MARKET INDICATORS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {INDICATORS.map((ind, i) => (
                <div key={i} style={{ background: "rgba(15,23,42,0.7)", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 8, color: "#334155", letterSpacing: 1.5, fontFamily: "monospace", marginBottom: 4 }}>{ind.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", fontFamily: "monospace" }}>{ind.value}</div>
                  <div style={{ fontSize: 9, color: "#475569", fontFamily: "monospace", marginTop: 2 }}>{ind.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RAG pipeline visual */}
          <div style={{ background: "rgba(13,17,23,0.8)", border: "1px solid #0f172a", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 9, color: "#334155", letterSpacing: 2, marginBottom: 12, fontFamily: "monospace" }}>HOW RAG WORKS</div>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
              {["User Question", "MiniLM Embed", "ChromaDB Search", "Top 3 Docs", "Groq LLaMA 3", "AI Answer"].map((s, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 6, padding: "5px 10px", fontSize: 10, color: "#10b981", fontFamily: "monospace", whiteSpace: "nowrap" }}>{s}</div>
                  {i < arr.length - 1 && <span style={{ fontSize: 10, color: "#334155" }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — chat */}
        <div style={{ background: "rgba(2,8,23,0.9)", borderLeft: "1px solid #0f172a", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #0f172a" }}>
            {[{ k: "chat", l: "AI ADVISOR" }, { k: "quick", l: "QUICK ASK" }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, padding: "10px 0", fontSize: 9, letterSpacing: 1.5, fontFamily: "monospace", cursor: "pointer", border: "none", background: "transparent", color: tab === t.k ? "#10b981" : "#334155", borderBottom: `2px solid ${tab === t.k ? "#10b981" : "transparent"}`, transition: "all 0.15s" }}>
                {t.l}
              </button>
            ))}
          </div>

          {tab === "chat" && (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 0" }}>
                {messages.map((m, i) => <Bubble key={i} msg={m} />)}
                {loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#0f766e,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>AI</div>
                    <div style={{ background: "rgba(30,41,59,0.9)", border: "1px solid #1e293b", borderRadius: "3px 14px 14px 14px", padding: "10px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: 14, borderTop: "1px solid #0f172a" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendQ()}
                    placeholder="Ask about Indian markets..."
                    style={{ flex: 1, background: "rgba(30,41,59,0.8)", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", padding: "9px 12px", fontSize: 12, fontFamily: "monospace", outline: "none" }} />
                  <button onClick={() => sendQ()} disabled={loading || !input.trim()}
                    style={{ background: loading || !input.trim() ? "#0f172a" : "linear-gradient(135deg,#0f766e,#1d4ed8)", border: "1px solid #1e293b", color: loading || !input.trim() ? "#334155" : "#fff", borderRadius: 8, width: 38, cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: 16 }}>▶</button>
                </div>
                <div style={{ fontSize: 9, color: "#1e293b", fontFamily: "monospace", textAlign: "center", marginTop: 6 }}>GROQ LLaMA 3 · CHROMADB RAG · YFINANCE</div>
              </div>
            </>
          )}

          {tab === "quick" && (
            <div style={{ padding: 14, flex: 1, overflowY: "auto" }}>
              <div style={{ fontSize: 9, color: "#334155", letterSpacing: 1.5, marginBottom: 12, fontFamily: "monospace" }}>TAP TO ASK</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {QUICK_QS.map((q, i) => (
                  <button key={i} onClick={() => { setTab("chat"); sendQ(q); }}
                    style={{ background: "rgba(13,17,23,0.8)", border: "1px solid #1e293b", borderRadius: 8, color: "#94a3b8", padding: "10px 14px", textAlign: "left", cursor: "pointer", fontSize: 11, fontFamily: "monospace", lineHeight: 1.5, transition: "all 0.15s" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.color = "#e2e8f0"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.color = "#94a3b8"; }}>
                    <span style={{ color: "#10b981", marginRight: 8, fontSize: 9 }}>▶</span>{q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        @keyframes marquee { from{transform:translateX(100vw)} to{transform:translateX(-100%)} }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:#020817}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
        body{background:#020817}
      `}</style>
    </div>
  );
}