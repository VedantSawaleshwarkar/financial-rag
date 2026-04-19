import { useState, useEffect } from "react";
import TickerCard from "../components/TickerCard";
import AreaChart from "../components/AreaChart";
import Spark from "../components/Spark";

const API = "http://localhost:8000";

const TICKER_META = {
  NIFTY50:   { label: "NIFTY 50",  code: "N50",  sub: "NSE" },
  SENSEX:    { label: "SENSEX",    code: "SNX",  sub: "BSE" },
  GOLD:      { label: "GOLD",      code: "XAU",  sub: "MCX" },
  CRUDE_OIL: { label: "CRUDE OIL", code: "CL",   sub: "WTI" },
  USD_INR:   { label: "USD / INR", code: "FX",   sub: "FOREX" },
  SILVER:    { label: "SILVER",    code: "XAG",  sub: "MCX" },
};

const Market = () => {
  const [market, setMarket] = useState({});
  const [history, setHistory] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState("NIFTY50");
  const [online, setOnline] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Mock data for demo mode
  const mockMarket = {
    NIFTY50: { price: 19750.25, change_pct: 0.85 },
    SENSEX: { price: 65890.50, change_pct: -0.32 },
    GOLD: { price: 72850.00, change_pct: 1.25 },
    CRUDE_OIL: { price: 4850.75, change_pct: -0.85 },
    USD_INR: { price: 83.47, change_pct: 0.12 },
    SILVER: { price: 89500.00, change_pct: 0.65 },
  };

  const mockHistory = {
    NIFTY50: [
      { date: "2026-04-01", close: 19500.00 },
      { date: "2026-04-02", close: 19600.00 },
      { date: "2026-04-03", close: 19700.00 },
      { date: "2026-04-04", close: 19650.00 },
      { date: "2026-04-07", close: 19750.25 },
    ],
    SENSEX: [
      { date: "2026-04-01", close: 65500.00 },
      { date: "2026-04-02", close: 65600.00 },
      { date: "2026-04-03", close: 65700.00 },
      { date: "2026-04-04", close: 65800.00 },
      { date: "2026-04-07", close: 65890.50 },
    ],
    GOLD: [
      { date: "2026-04-01", close: 72000.00 },
      { date: "2026-04-02", close: 72300.00 },
      { date: "2026-04-03", close: 72600.00 },
      { date: "2026-04-04", close: 72500.00 },
      { date: "2026-04-07", close: 72850.00 },
    ],
    CRUDE_OIL: [
      { date: "2026-04-01", close: 4900.00 },
      { date: "2026-04-02", close: 4880.00 },
      { date: "2026-04-03", close: 4860.00 },
      { date: "2026-04-04", close: 4870.00 },
      { date: "2026-04-07", close: 4850.75 },
    ],
    USD_INR: [
      { date: "2026-04-01", close: 83.20 },
      { date: "2026-04-02", close: 83.30 },
      { date: "2026-04-03", close: 83.35 },
      { date: "2026-04-04", close: 83.40 },
      { date: "2026-04-07", close: 83.47 },
    ],
    SILVER: [
      { date: "2026-04-01", close: 88000.00 },
      { date: "2026-04-02", close: 88500.00 },
      { date: "2026-04-03", close: 89000.00 },
      { date: "2026-04-04", close: 89200.00 },
      { date: "2026-04-07", close: 89500.00 },
    ],
  };

  const newsItems = [
    { time: "2 mins ago", text: "Nifty 50 gains 0.8% amid positive global cues", category: "MARKET" },
    { time: "15 mins ago", text: "Gold prices surge to 1-month high on safe-haven demand", category: "COMMODITIES" },
    { time: "1 hour ago", text: "RBI keeps repo rate unchanged at 6.50%", category: "ECONOMY" },
    { time: "2 hours ago", text: "Crude oil slips on demand concerns", category: "ENERGY" },
    { time: "3 hours ago", text: "USD strengthens against major currencies", category: "FOREX" },
    { time: "4 hours ago", text: "Silver outperforms gold with 2% gains", category: "COMMODITIES" },
  ];

  useEffect(() => {
    fetchMarketData();
    fetchAllHistory();
    const interval = setInterval(() => {
      fetchMarketData();
      fetchAllHistory();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch(`${API}/market`);
      if (response.ok) {
        const data = await response.json();
        setMarket(data);
        setOnline(true);
        setDemoMode(false);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      setMarket(mockMarket);
      setOnline(false);
      setDemoMode(true);
    }
  };

  const fetchAllHistory = async () => {
    const historyData = {};
    
    for (const symbol of Object.keys(TICKER_META)) {
      try {
        const response = await fetch(`${API}/history/${symbol}`);
        if (response.ok) {
          const data = await response.json();
          historyData[symbol] = data.length > 0 ? data : mockHistory[symbol];
        } else {
          historyData[symbol] = mockHistory[symbol];
        }
      } catch {
        historyData[symbol] = mockHistory[symbol];
      }
    }
    
    setHistory(historyData);
  };

  const calculateSparkVals = (symbol) => {
    const hist = history[symbol] || [];
    return hist.slice(-20).map(d => d.close);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#020817", 
      color: "#e2e8f0", 
      fontFamily: "'IBM Plex Mono','Courier New',monospace",
      marginLeft: "250px" // Account for sidebar
    }}>
      
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

      {/* Header */}
      <div style={{
        padding: "20px",
        borderBottom: "1px solid #1e293b",
        background: "rgba(13,17,23,0.8)"
      }}>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#f1f5f9",
          marginBottom: "8px",
          letterSpacing: "2px"
        }}>
          <span style={{ color: "#10b981" }}>MARKET</span> OVERVIEW
        </h1>
        <div style={{
          fontSize: "12px",
          color: "#94a3b8",
          letterSpacing: "1px"
        }}>
          Real-time market data for Indian and global markets
        </div>
      </div>

      {/* News Ticker */}
      <div style={{
        background: "rgba(16,185,129,0.1)",
        borderBottom: "1px solid rgba(16,185,129,0.3)",
        padding: "12px 20px",
        overflow: "hidden"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}>
          <div style={{
            fontSize: "10px",
            color: "#10b981",
            fontWeight: "600",
            letterSpacing: "1px",
            whiteSpace: "nowrap"
          }}>
            BREAKING NEWS
          </div>
          <div style={{
            display: "flex",
            gap: "30px",
            animation: "marquee 30s linear infinite"
          }}>
            {newsItems.map((news, index) => (
              <div key={index} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                whiteSpace: "nowrap"
              }}>
                <span style={{
                  fontSize: "9px",
                  color: "#334155",
                  fontFamily: "monospace"
                }}>
                  {news.time}
                </span>
                <span style={{
                  fontSize: "10px",
                  color: "#e2e8f0"
                }}>
                  {news.text}
                </span>
                <span style={{
                  fontSize: "9px",
                  color: "#10b981",
                  background: "rgba(16,185,129,0.2)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontFamily: "monospace"
                }}>
                  {news.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Large Price Cards */}
      <div style={{
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "20px"
      }}>
        {Object.entries(market).map(([name, data]) => (
          <TickerCard
            key={name}
            name={name}
            data={data}
            meta={TICKER_META[name]}
            selected={selectedSymbol === name}
            onClick={() => setSelectedSymbol(name)}
            sparkVals={calculateSparkVals(name)}
          />
        ))}
      </div>

      {/* Detailed Chart Section */}
      <div style={{
        padding: "0 20px 20px"
      }}>
        <div style={{
          background: "rgba(13,17,23,0.8)",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "30px"
        }}>
          {/* Chart Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px"
          }}>
            <div>
              <h2 style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#f1f5f9",
                marginBottom: "8px",
                letterSpacing: "1px"
              }}>
                {selectedSymbol} · {TICKER_META[selectedSymbol]?.sub}
              </h2>
              <div style={{
                fontSize: "12px",
                color: "#94a3b8"
              }}>
                Historical Price Chart
              </div>
            </div>
            
            <div style={{
              display: "flex",
              gap: "8px"
            }}>
              {Object.keys(TICKER_META).map(symbol => (
                <button
                  key={symbol}
                  onClick={() => setSelectedSymbol(symbol)}
                  style={{
                    background: selectedSymbol === symbol ? "rgba(16,185,129,0.1)" : "transparent",
                    border: `1px solid ${selectedSymbol === symbol ? "#10b981" : "#1e293b"}`,
                    color: selectedSymbol === symbol ? "#10b981" : "#475569",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    fontFamily: "monospace",
                    transition: "all 0.15s"
                  }}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div style={{
            height: "400px",
            background: "rgba(2,8,23,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <AreaChart history={history[selectedSymbol] || []} />
          </div>

          {/* Market Statistics */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            <div style={{
              background: "rgba(2,8,23,0.8)",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px"
            }}>
              <div style={{
                fontSize: "10px",
                color: "#334155",
                letterSpacing: "1.5px",
                marginBottom: "8px"
              }}>
                CURRENT PRICE
              </div>
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#f1f5f9",
                fontFamily: "monospace"
              }}>
                {market[selectedSymbol]?.price?.toLocaleString("en-IN") || "0.00"}
              </div>
            </div>
            
            <div style={{
              background: "rgba(2,8,23,0.8)",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px"
            }}>
              <div style={{
                fontSize: "10px",
                color: "#334155",
                letterSpacing: "1.5px",
                marginBottom: "8px"
              }}>
                DAY CHANGE
              </div>
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: (market[selectedSymbol]?.change_pct ?? 0) >= 0 ? "#10b981" : "#ef4444",
                fontFamily: "monospace"
              }}>
                {(market[selectedSymbol]?.change_pct ?? 0) >= 0 ? "+" : ""}
                {market[selectedSymbol]?.change_pct?.toFixed(2) || "0.00"}%
              </div>
            </div>
            
            <div style={{
              background: "rgba(2,8,23,0.8)",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px"
            }}>
              <div style={{
                fontSize: "10px",
                color: "#334155",
                letterSpacing: "1.5px",
                marginBottom: "8px"
              }}>
                VOLUME
              </div>
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#f1f5f9",
                fontFamily: "monospace"
              }}>
                {Math.floor(Math.random() * 100000000).toLocaleString("en-IN")}
              </div>
            </div>
            
            <div style={{
              background: "rgba(2,8,23,0.8)",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px"
            }}>
              <div style={{
                fontSize: "10px",
                color: "#334155",
                letterSpacing: "1.5px",
                marginBottom: "8px"
              }}>
                MARKET CAP
              </div>
              <div style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#f1f5f9",
                fontFamily: "monospace"
              }}>
                {Math.floor(Math.random() * 10000000).toLocaleString("en-IN")} Cr
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:#020817}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
        body{background:#020817}
      `}</style>
    </div>
  );
};

export default Market;
