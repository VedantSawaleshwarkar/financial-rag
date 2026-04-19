import { useState, useEffect, useRef } from "react";
import TickerCard from "../components/TickerCard";
import AreaChart from "../components/AreaChart";
import ChatBubble from "../components/ChatBubble";

const API = "http://localhost:8000";

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
  { label: "CPI Inflation",  value: "4.8%",        note: "Within 2-6% target" },
  { label: "Nifty P/E",      value: "23.4x",       note: "Slightly elevated" },
  { label: "FII Flow MTD",   value: "+2,840 Cr",   note: "Net inflow" },
  { label: "INR / USD",      value: "83.47",       note: "Stable range" },
];

const Dashboard = () => {
  const [market, setMarket] = useState({});
  const [history, setHistory] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(false);
  const [activeChart, setActiveChart] = useState("NSEI");
  const [activeTk, setActiveTk] = useState("NIFTY50");
  const [tab, setTab] = useState("chat");
  const [demoMode, setDemoMode] = useState(false);
  const [marketStatus, setMarketStatus] = useState("CLOSED");
  const [lastUpdated, setLastUpdated] = useState("");
  const [priceFlashes, setPriceFlashes] = useState({});
  const chatEndRef = useRef(null);
  const wsRef = useRef(null);

  const chartOptions = [
    { key: "NSEI", label: "NIFTY 50" },
    { key: "BSESN", label: "SENSEX" },
  ];

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Try different WebSocket URL formats
        const wsUrl = window.location.protocol === 'https:' ? 'wss://localhost:8000/ws/market' : 'ws://localhost:8000/ws/market';
        console.log('Attempting WebSocket connection to:', wsUrl);
        
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected successfully');
          setOnline(true);
          setDemoMode(false);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received WebSocket data:', data);
            
            // Detect price changes for flash animation
            Object.keys(data).forEach(symbol => {
              if (market[symbol] && market[symbol].price !== data[symbol].price) {
                const isUp = data[symbol].price > market[symbol].price;
                setPriceFlashes(prev => ({
                  ...prev,
                  [symbol]: { flash: true, isUp }
                }));
                
                // Clear flash after 600ms
                setTimeout(() => {
                  setPriceFlashes(prev => ({
                    ...prev,
                    [symbol]: { flash: false, isUp: prev[symbol]?.isUp || isUp }
                  }));
                }, 600);
              }
            });
            
            setMarket(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          setOnline(false);
          // Reconnect every 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setOnline(false);
          setDemoMode(true);
          
          // Fallback to polling if WebSocket fails
          console.log('Falling back to HTTP polling');
          startPolling();
        };

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setOnline(false);
        setDemoMode(true);
        startPolling();
      }
    };

    const startPolling = () => {
      const pollData = async () => {
        try {
          const response = await fetch(`${API}/market`);
          if (response.ok) {
            const data = await response.json();
            setMarket(data);
            setDemoMode(false);
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      };

      pollData(); // Initial fetch
      const pollingInterval = setInterval(pollData, 15000); // Poll every 15 seconds
      
      return () => clearInterval(pollingInterval);
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Fetch market summary for status
  useEffect(() => {
    const fetchMarketSummary = async () => {
      try {
        const response = await fetch(`${API}/market/summary`);
        if (response.ok) {
          const data = await response.json();
          setMarketStatus(data.status);
          setLastUpdated(new Date(data.last_updated).toLocaleTimeString('en-IN'));
        }
      } catch (error) {
        console.error('Failed to fetch market summary:', error);
      }
    };

    fetchMarketSummary();
    const interval = setInterval(fetchMarketSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch intraday history for active chart
  useEffect(() => {
    const fetchIntradayHistory = async () => {
      try {
        const response = await fetch(`${API}/history/${activeChart}?interval=1m`);
        if (response.ok) {
          const data = await response.json();
          setHistory(prev => ({ ...prev, [activeChart]: data }));
        }
      } catch (error) {
        console.error('Failed to fetch intraday data:', error);
      }
    };

    fetchIntradayHistory();
  }, [activeChart]);

  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, loading]);

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
        body: JSON.stringify({ question })
      });
      const d = await r.json();
      setMessages(p => [...p, { role: "assistant", content: d.answer, context: d.sources || "" }]);
    } catch (e) {
      setMessages(p => [...p, { role: "assistant", content: "Service temporarily unavailable. Please try again.", context: "" }]);
    } finally {
      setLoading(false);
    }
  }

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#020817", 
      color: "#e2e8f0", 
      fontFamily: "'IBM Plex Mono','Courier New',monospace", 
      display: "flex", 
      flexDirection: "column",
      marginLeft: "250px" // Account for sidebar
    }}>
      
      {/* Live Status Bar */}
      <div style={{
        background: "rgba(13,17,23,0.8)",
        borderBottom: "1px solid #1e293b",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: "20px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: marketStatus === "OPEN" ? "#10b981" : "#ef4444",
            boxShadow: marketStatus === "OPEN" ? "0 0 6px rgba(16,185,129,0.5)" : "0 0 6px rgba(239,68,68,0.5)",
            animation: marketStatus === "OPEN" ? "pulse 2s infinite" : "none"
          }} />
          <div style={{
            fontSize: "11px",
            fontWeight: "600",
            color: marketStatus === "OPEN" ? "#10b981" : "#ef4444",
            letterSpacing: "1px"
          }}>
            NSE {marketStatus}
          </div>
        </div>
        
        <div style={{
          fontSize: "10px",
          color: "#94a3b8",
          letterSpacing: "1px"
        }}>
          Last updated: {lastUpdated}
        </div>
        
        <div style={{
          fontSize: "10px",
          color: "#334155",
          letterSpacing: "1px"
        }}>
          {Object.keys(market).length} instruments tracked
        </div>
      </div>

      {/* Demo Mode Badge */}
      {demoMode && (
        <div style={{
          background: "#f59e0b",
          color: "#000",
          padding: "8px 16px",
          fontSize: "10px",
          fontWeight: "600",
          letterSpacing: "1px",
          textAlign: "center",
          borderBottom: "1px solid #1e293b"
        }}>
          DEMO MODE - Backend Offline
        </div>
      )}
      
      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", padding: "20px" }}>
        {/* Left - Market Overview */}
        <div style={{ flex: 1, paddingRight: "20px" }}>
          <div style={{ fontSize: 12, color: "#334155", letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>MARKET OVERVIEW</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {Object.entries(market).map(([name, data]) => (
              <TickerCard
                key={name}
                name={name}
                data={data}
                meta={TICKER_META[name]}
                selected={activeTk === name}
                onClick={() => { setActiveChart(name === "NSEI" ? "NSEI" : name === "BSESN" ? "BSESN" : name); setActiveTk(name); }}
                sparkVals={history[name]?.slice(-20).map(d => d.close) || []}
                priceFlash={priceFlashes[name]}
              />
            ))}
          </div>
        </div>

        {/* Center - Chart */}
        <div style={{ flex: 1, padding: "0 20px" }}>
          <div style={{ fontSize: 12, color: "#334155", letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>CHARTS</div>
          
          {/* Chart Options */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {chartOptions.map(o => (
              <button key={o.key} onClick={() => { setActiveChart(o.key); setActiveTk(o.key === "NSEI" ? "NIFTY50" : "SENSEX"); }}
                style={{ background: activeChart === o.key ? "rgba(16,185,129,0.1)" : "transparent", border: `1px solid ${activeChart === o.key ? "#10b981" : "#1e293b"}`, color: activeChart === o.key ? "#10b981" : "#475569", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 12, letterSpacing: 1, fontFamily: "monospace", transition: "all 0.15s" }}>
                {o.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div style={{ background: "rgba(13,17,23,0.8)", border: "1px solid #0f172a", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#334155", letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>{activeTk.toUpperCase()} · {TICKER_META[activeTk]?.sub}</div>
            <AreaChart history={history[activeChart] || []} />
          </div>

          {/* Indicators */}
          <div style={{ fontSize: 12, color: "#334155", letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>ECONOMIC INDICATORS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {INDICATORS.map((ind, i) => (
              <div key={i} style={{ background: "rgba(13,17,23,0.8)", border: "1px solid #0f172a", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1.5, marginBottom: 8 }}>{ind.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "monospace" }}>{ind.value}</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginTop: 4 }}>{ind.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Chat */}
        <div style={{ flex: 1, paddingLeft: "20px", maxWidth: 400 }}>
          <div style={{ fontSize: 12, color: "#334155", letterSpacing: 2, marginBottom: 16, fontFamily: "monospace" }}>AI ADVISOR</div>
          
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #0f172a", marginBottom: 16 }}>
            {[{ k: "chat", l: "CHAT" }, { k: "quick", l: "QUICK ASK" }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, padding: "12px 0", fontSize: 10, letterSpacing: 1.5, fontFamily: "monospace", cursor: "pointer", border: "none", background: "transparent", color: tab === t.k ? "#10b981" : "#334155", borderBottom: `2px solid ${tab === t.k ? "#10b981" : "transparent"}`, transition: "all 0.15s" }}>
                {t.l}
              </button>
            ))}
          </div>

          <div style={{ background: "rgba(13,17,23,0.8)", border: "1px solid #0f172a", borderRadius: 12, height: "500px", display: "flex", flexDirection: "column" }}>
            {tab === "chat" && (
              <>
                <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                  {messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
                  {loading && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#0f766e,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>AI</div>
                      <div style={{ background: "rgba(30,41,59,0.9)", border: "1px solid #1e293b", borderRadius: "3px 14px 14px 14px", padding: "10px 14px", display: "flex", gap: 5, alignItems: "center" }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ padding: 16, borderTop: "1px solid #0f172a" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendQ()}
                      placeholder="Ask about Indian markets..."
                      style={{ flex: 1, background: "rgba(30,41,59,0.8)", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", padding: "10px 12px", fontSize: 12, fontFamily: "monospace", outline: "none" }} />
                    <button onClick={() => sendQ()} disabled={loading || !input.trim()}
                      style={{ background: loading || !input.trim() ? "#0f172a" : "linear-gradient(135deg,#0f766e,#1d4ed8)", border: "1px solid #1e293b", color: loading || !input.trim() ? "#334155" : "#fff", borderRadius: 8, width: 40, cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: 16 }}>{">"}</button>
                  </div>
                  <div style={{ fontSize: 9, color: "#1e293b", fontFamily: "monospace", textAlign: "center", marginTop: 8 }}>GROQ LLaMA 3 · CHROMADB RAG · YFINANCE</div>
                </div>
              </>
            )}

            {tab === "quick" && (
              <div style={{ padding: 16, flex: 1, overflowY: "auto" }}>
                <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1.5, marginBottom: 16, fontFamily: "monospace" }}>TAP TO ASK</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {QUICK_QS.map((q, i) => (
                    <button key={i} onClick={() => { setTab("chat"); sendQ(q); }} style={{ background: "rgba(30,41,59,0.8)", border: "1px solid #1e293b", borderRadius: 8, color: "#94a3b8", padding: "12px 16px", textAlign: "left", cursor: "pointer", fontSize: 11, fontFamily: "monospace", lineHeight: 1.5, transition: "all 0.15s" }} onMouseOver={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.color = "#e2e8f0"; }} onMouseOut={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.color = "#94a3b8"; }}>
                      <span style={{ color: "#10b981", marginRight: 8, fontSize: 10 }}>{">"}</span>{q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:#020817}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
        body{background:#020817}
      `}</style>
    </div>
  );
};

export default Dashboard;
