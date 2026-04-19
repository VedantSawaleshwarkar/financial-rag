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
  const [intradayHistory, setIntradayHistory] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState("NIFTY50");
  const [online, setOnline] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [marketStatus, setMarketStatus] = useState("CLOSED");
  const [lastUpdated, setLastUpdated] = useState("");
  const [priceFlashes, setPriceFlashes] = useState({});

  // Mock data for demo mode
  const mockMarket = {
    NIFTY50: { price: 19750.25, change_pct: 0.85, open: 19600.00, high: 19800.00, low: 19550.00, volume: 124000000 },
    SENSEX: { price: 65890.50, change_pct: -0.32, open: 66100.00, high: 66200.00, low: 65700.00, volume: 98000000 },
    GOLD: { price: 72850.00, change_pct: 1.25, open: 72000.00, high: 73000.00, low: 71800.00, volume: 45000 },
    CRUDE_OIL: { price: 4850.75, change_pct: -0.85, open: 4900.00, high: 4920.00, low: 4840.00, volume: 120000 },
    USD_INR: { price: 83.47, change_pct: 0.12, open: 83.35, high: 83.55, low: 83.30, volume: 0 },
    SILVER: { price: 89500.00, change_pct: 0.65, open: 88900.00, high: 89800.00, low: 88700.00, volume: 32000 },
  };

  const mockIntradayHistory = {
    NIFTY50: [
      { date: "2026-04-20 09:15", open: 19600.00, high: 19750.25, low: 19550.00, close: 19750.25, volume: 124000000 },
      { date: "2026-04-20 09:30", open: 19750.25, high: 19800.00, low: 19700.00, close: 19800.00, volume: 145000000 },
      { date: "2026-04-20 10:00", open: 19800.00, high: 19850.00, low: 19750.00, close: 19800.00, volume: 167000000 },
      { date: "2026-04-20 10:30", open: 19800.00, high: 19800.00, low: 19650.00, close: 19650.00, volume: 189000000 },
      { date: "2026-04-20 11:00", open: 19650.00, high: 19700.00, low: 19600.00, close: 19750.25, volume: 210000000 },
    ],
    SENSEX: [
      { date: "2026-04-20 09:15", open: 66100.00, high: 65890.50, low: 65700.00, close: 65890.50, volume: 98000000 },
      { date: "2026-04-20 09:30", open: 65890.50, high: 66200.00, low: 65800.00, close: 66200.00, volume: 112000000 },
      { date: "2026-04-20 10:00", open: 66200.00, high: 66500.00, low: 65800.00, close: 66500.00, volume: 134000000 },
      { date: "2026-04-20 10:30", open: 66500.00, high: 66500.00, low: 66100.00, close: 66100.00, volume: 156000000 },
      { date: "2026-04-20 11:00", open: 66100.00, high: 66150.00, low: 65800.00, close: 65890.50, volume: 178000000 },
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
    const connectWebSocket = () => {
      try {
        // Try different WebSocket URL formats
        const wsUrl = window.location.protocol === 'https:' ? 'wss://localhost:8000/ws/market' : 'ws://localhost:8000/ws/market';
        console.log('Attempting Market WebSocket connection to:', wsUrl);
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('Market WebSocket connected successfully');
          setOnline(true);
          setDemoMode(false);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received Market WebSocket data:', data);
            
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
            console.error('Error parsing Market WebSocket message:', error);
          }
        };

        ws.onclose = (event) => {
          console.log('Market WebSocket disconnected:', event.code, event.reason);
          setOnline(false);
          // Reconnect every 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('Market WebSocket error:', error);
          setOnline(false);
          setDemoMode(true);
          
          // Fallback to polling if WebSocket fails
          console.log('Falling back to HTTP polling for Market page');
          startMarketPolling();
        };

      } catch (error) {
        console.error('Failed to connect Market WebSocket:', error);
        setOnline(false);
        setDemoMode(true);
        startMarketPolling();
      }
    };

    const startMarketPolling = () => {
      const pollData = async () => {
        try {
          const response = await fetch(`${API}/market`);
          if (response.ok) {
            const data = await response.json();
            setMarket(data);
            setDemoMode(false);
          }
        } catch (error) {
          console.error('Market polling error:', error);
        }
      };

      pollData(); // Initial fetch
      const pollingInterval = setInterval(pollData, 15000); // Poll every 15 seconds
      
      return () => clearInterval(pollingInterval);
    };

    connectWebSocket();

    return () => {
      // Cleanup WebSocket on unmount
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

  // Fetch intraday history for candlestick chart
  useEffect(() => {
    const fetchIntradayHistory = async () => {
      try {
        const response = await fetch(`${API}/history/${selectedSymbol}?interval=1m`);
        if (response.ok) {
          const data = await response.json();
          setIntradayHistory(prev => ({ ...prev, [selectedSymbol]: data }));
        }
      } catch (error) {
        console.error('Failed to fetch intraday data:', error);
        // Use mock data as fallback
        setIntradayHistory(prev => ({ ...prev, [selectedSymbol]: mockIntradayHistory[selectedSymbol] || [] }));
      }
    };

    fetchIntradayHistory();
  }, [selectedSymbol]);

  const calculateSparkVals = (symbol) => {
    const hist = history[symbol] || [];
    return hist.slice(-20).map(d => d.close);
  };

  // Simple Candlestick Component
  const CandlestickChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontSize: "12px",
          fontFamily: "monospace"
        }}>
          No intraday data available
        </div>
      );
    }

    const width = 800;
    const height = 400;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Calculate price range
    const prices = data.flatMap(d => [d.open, d.high, d.low, d.close]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Calculate candle dimensions
    const candleWidth = Math.max(2, (chartWidth / data.length) - 2);
    const candleSpacing = candleWidth + 2;
    
    return (
      <div style={{
        width: "100%",
        height: "400px",
        background: "rgba(2,8,23,0.8)",
        border: "1px solid #1e293b",
        borderRadius: "12px",
        padding: "20px",
        position: "relative"
      }}>
        {/* Price labels on Y-axis */}
        <div style={{
          position: "absolute",
          left: "10px",
          top: "20px",
          fontSize: "10px",
          color: "#334155",
          fontFamily: "monospace"
        }}>
          <div style={{ marginBottom: "5px" }}>{maxPrice.toLocaleString("en-IN")}</div>
          <div style={{ marginBottom: "5px" }}>{((minPrice + maxPrice) / 2).toLocaleString("en-IN")}</div>
          <div>{minPrice.toLocaleString("en-IN")}</div>
        </div>
        
        {/* Candlesticks */}
        <svg width={width} height={height} style={{ display: "block" }}>
          {data.map((candle, index) => {
            const x = padding + index * candleSpacing + candleWidth / 2;
            const yOpen = chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
            const yClose = chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
            const yHigh = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
            const yLow = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
            
            const isGreen = candle.close >= candle.open;
            const color = isGreen ? "#10b981" : "#ef4444";
            
            return (
              <g key={index}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke={color}
                  strokeWidth="1"
                />
                
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={Math.min(yOpen, yClose)}
                  width={candleWidth}
                  height={Math.abs(yClose - yOpen) || 1}
                  fill={color}
                  stroke={color}
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
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
            priceFlash={priceFlashes[name]}
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
                Live Intraday Chart
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

          {/* Candlestick Chart */}
          <div style={{
            height: "400px",
            background: "rgba(2,8,23,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <CandlestickChart data={intradayHistory[selectedSymbol] || []} />
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
                {market[selectedSymbol]?.volume ? formatVolume(market[selectedSymbol].volume) : "0"}
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
        @keyframes priceFlash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
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

const formatVolume = (volume) => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
};

export default Market;
