import { useEffect, useRef, useState } from "react";
import TickerCard from "../components/TickerCard";
import AdvancedTradingChart from "../components/AdvancedTradingChart";

const API = "http://localhost:8000";

const INSTRUMENTS = [
  { key: "NIFTY50", label: "NIFTY 50", code: "N50", venue: "NSE", apiSymbol: "NSEI" },
  { key: "SENSEX", label: "SENSEX", code: "SNX", venue: "BSE", apiSymbol: "BSESN" },
  { key: "GOLD", label: "Gold", code: "XAU", venue: "MCX", apiSymbol: "GC=F" },
  { key: "CRUDE_OIL", label: "Crude Oil", code: "CL", venue: "WTI", apiSymbol: "CL=F" },
  { key: "USD_INR", label: "USD / INR", code: "FX", venue: "FOREX", apiSymbol: "USDINR=X" },
  { key: "SILVER", label: "Silver", code: "XAG", venue: "MCX", apiSymbol: "SI=F" },
];

const TICKER_META = Object.fromEntries(INSTRUMENTS.map((item) => [item.key, item]));

const INDICATORS = [
  { label: "RBI Repo Rate", value: "6.50%", note: "Unchanged since Apr 2025" },
  { label: "India GDP FY26", value: "7.2%", note: "IMF projection" },
  { label: "CPI Inflation", value: "4.8%", note: "Comfortably in target band" },
  { label: "Nifty P/E", value: "23.4x", note: "Above long-term average" },
  { label: "FII Flow MTD", value: "+2,840 Cr", note: "Positive institutional flows" },
  { label: "USD / INR", value: "83.47", note: "Stable near recent range" },
];

const SUMMARY_ITEMS = [
  { key: "advancers", label: "Advancers", value: "4 / 6" },
  { key: "laggards", label: "Laggards", value: "2 / 6" },
  { key: "focus", label: "Focus", value: "Intraday Risk" },
];

const sectionEyebrow = {
  color: "#7c8aa5",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const panelStyle = {
  background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(8,15,30,0.88))",
  border: "1px solid rgba(96,165,250,0.12)",
  borderRadius: 24,
  boxShadow: "0 24px 60px rgba(2,6,23,0.42)",
  backdropFilter: "blur(18px)",
};

function Dashboard() {
  const [market, setMarket] = useState({});
  const [history, setHistory] = useState({});
  const [activeTicker, setActiveTicker] = useState("NIFTY50");
  const [marketStatus, setMarketStatus] = useState("CLOSED");
  const [lastUpdated, setLastUpdated] = useState("");
  const [dataSource, setDataSource] = useState("fallback");
  const [priceFlashes, setPriceFlashes] = useState({});

  const wsRef = useRef(null);
  const pollingRef = useRef(null);
  const marketRef = useRef({});

  const activeMeta = TICKER_META[activeTicker];
  const activeHistory = history[activeMeta.apiSymbol] || [];

  useEffect(() => {
    marketRef.current = market;
  }, [market]);

  useEffect(() => {
    const startPolling = () => {
      if (pollingRef.current) {
        return;
      }

      const pollData = async () => {
        try {
          const response = await fetch(`${API}/market`);
          if (response.ok) {
            const data = await response.json();
            setMarket(data);
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      };

      pollData();
      pollingRef.current = setInterval(pollData, 15000);
    };

    const stopPolling = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };

    const connectWebSocket = () => {
      try {
        const wsUrl =
          window.location.protocol === "https:"
            ? "wss://localhost:8000/ws/market"
            : "ws://localhost:8000/ws/market";

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          stopPolling();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const previousMarket = marketRef.current;

            Object.keys(data).forEach((symbol) => {
              if (previousMarket[symbol] && previousMarket[symbol].price !== data[symbol].price) {
                const isUp = data[symbol].price > previousMarket[symbol].price;
                setPriceFlashes((prev) => ({
                  ...prev,
                  [symbol]: { flash: true, isUp },
                }));

                window.setTimeout(() => {
                  setPriceFlashes((prev) => ({
                    ...prev,
                    [symbol]: { flash: false, isUp: prev[symbol]?.isUp ?? isUp },
                  }));
                }, 600);
              }
            });

            setMarket(data);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = () => {
          startPolling();
          window.setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = () => {
          startPolling();
        };
      } catch (error) {
        console.error("WebSocket connection failed:", error);
        startPolling();
      }
    };

    connectWebSocket();

    return () => {
      stopPolling();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchMarketSummary = async () => {
      try {
        const response = await fetch(`${API}/market/summary`);
        if (response.ok) {
          const data = await response.json();
          setMarketStatus(data.status);
          setDataSource(data.data_source || "fallback");
          setLastUpdated(new Date(data.last_updated).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch market summary:", error);
      }
    };

    fetchMarketSummary();
    const interval = setInterval(fetchMarketSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchIntradayHistory = async () => {
      try {
        const response = await fetch(`${API}/history/${activeMeta.apiSymbol}?interval=1m`);
        if (response.ok) {
          const data = await response.json();
          setHistory((prev) => ({ ...prev, [activeMeta.apiSymbol]: data }));
        }
      } catch (error) {
        console.error("Failed to fetch intraday data:", error);
      }
    };

    fetchIntradayHistory();
  }, [activeMeta.apiSymbol]);

  const trackedCount = Object.keys(market).length;
  const positiveCount = Object.values(market).filter((item) => (item?.change_pct ?? 0) >= 0).length;
  const negativeCount = Math.max(trackedCount - positiveCount, 0);
  const movers = Object.entries(market)
    .sort(([, a], [, b]) => Math.abs(b?.change_pct ?? 0) - Math.abs(a?.change_pct ?? 0))
    .slice(0, 3);

  return (
    <div
      style={{
        minHeight: "100vh",
        marginLeft: "var(--app-shell-offset, 250px)",
        padding: "28px",
        background:
          "radial-gradient(circle at top left, rgba(14,116,144,0.16), transparent 32%), radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 28%), #020817",
        color: "#e2e8f0",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      }}
    >
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div style={{ ...panelStyle, padding: 24, marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={sectionEyebrow}>Live Dashboard</div>
              <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.1 }}>
                Cleaner, calmer market monitoring
              </h1>
              <p style={{ margin: 0, color: "#94a3b8", maxWidth: 680, lineHeight: 1.7, fontSize: 14 }}>
                Prioritized cards, a larger chart surface, and a tighter indicator rail make the dashboard easier
                to scan at a glance.
              </p>
            </div>

            <div
              style={{
                minWidth: 280,
                padding: 18,
                borderRadius: 18,
                border: "1px solid rgba(148,163,184,0.12)",
                background: "rgba(2,6,23,0.42)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: marketStatus === "OPEN" ? "#22c55e" : "#f87171",
                    boxShadow:
                      marketStatus === "OPEN"
                        ? "0 0 14px rgba(34,197,94,0.45)"
                        : "0 0 14px rgba(248,113,113,0.35)",
                  }}
                />
                <span style={{ fontSize: 12, color: "#cbd5e1", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Market {marketStatus}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Updated
                  </div>
                  <div style={{ marginTop: 6, fontSize: 16, color: "#f8fafc", fontWeight: 600 }}>{lastUpdated || "--:--"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Tracked
                  </div>
                  <div style={{ marginTop: 6, fontSize: 16, color: "#f8fafc", fontWeight: 600 }}>{trackedCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Leaders
                  </div>
                  <div style={{ marginTop: 6, fontSize: 16, color: "#22c55e", fontWeight: 600 }}>{positiveCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Source
                  </div>
                  <div style={{ marginTop: 6, fontSize: 16, color: dataSource === "live" ? "#38bdf8" : "#fbbf24", fontWeight: 600 }}>
                    {dataSource.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
              marginTop: 20,
            }}
          >
            {SUMMARY_ITEMS.map((item) => (
              <div
                key={item.key}
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.1)",
                  background: "rgba(6,11,24,0.72)",
                  padding: "16px 18px",
                }}
              >
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                  {item.label}
                </div>
                <div style={{ marginTop: 10, fontSize: 22, color: "#f8fafc", fontWeight: 700 }}>{item.value}</div>
              </div>
            ))}
            <div
              style={{
                borderRadius: 18,
                border: "1px solid rgba(148,163,184,0.1)",
                background: "rgba(6,11,24,0.72)",
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                Breadth
              </div>
              <div style={{ marginTop: 10, fontSize: 22, color: "#f8fafc", fontWeight: 700 }}>
                {positiveCount} / {negativeCount}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <section style={{ ...panelStyle, padding: 22 }}>
            <div style={{ ...sectionEyebrow, marginBottom: 16 }}>Market Overview</div>
            <div style={{ display: "grid", gap: 14 }}>
              {INSTRUMENTS.map((instrument) => (
                <TickerCard
                  key={instrument.key}
                  name={instrument.key}
                  data={market[instrument.key]}
                  meta={instrument}
                  selected={activeTicker === instrument.key}
                  onClick={() => setActiveTicker(instrument.key)}
                  sparkVals={history[instrument.apiSymbol]?.slice(-20).map((point) => point.close) || []}
                  priceFlash={priceFlashes[instrument.key]}
                />
              ))}
            </div>
          </section>

          <section style={{ display: "grid", gap: 18 }}>
            <div style={{ ...panelStyle, padding: 22 }}>
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
                  <div style={sectionEyebrow}>Focused Chart</div>
                  <div style={{ marginTop: 8, fontSize: 26, fontWeight: 700, color: "#f8fafc" }}>{activeMeta.label}</div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {INSTRUMENTS.map((instrument) => (
                    <button
                      key={instrument.key}
                      onClick={() => setActiveTicker(instrument.key)}
                      style={{
                        border: activeTicker === instrument.key ? "1px solid #38bdf8" : "1px solid rgba(148,163,184,0.14)",
                        background: activeTicker === instrument.key ? "rgba(56,189,248,0.12)" : "rgba(2,6,23,0.5)",
                        color: activeTicker === instrument.key ? "#e0f2fe" : "#94a3b8",
                        borderRadius: 999,
                        padding: "9px 14px",
                        cursor: "pointer",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontFamily: "inherit",
                      }}
                    >
                      {instrument.code}
                    </button>
                  ))}
                </div>
              </div>

              <AdvancedTradingChart history={activeHistory} symbol={`${activeMeta.label} | ${activeMeta.venue}`} />
            </div>

            <div style={{ ...panelStyle, padding: 22 }}>
              <div style={{ ...sectionEyebrow, marginBottom: 16 }}>Quick Movers</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {movers.map(([key, data]) => {
                  const meta = TICKER_META[key];
                  const positive = (data?.change_pct ?? 0) >= 0;
                  return (
                    <div
                      key={key}
                      style={{
                        borderRadius: 18,
                        border: "1px solid rgba(148,163,184,0.1)",
                        background: "rgba(4,9,20,0.66)",
                        padding: 16,
                      }}
                    >
                      <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        {meta?.label || key}
                      </div>
                      <div style={{ marginTop: 10, fontSize: 24, fontWeight: 700, color: "#f8fafc" }}>
                        {data?.price?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "--"}
                      </div>
                      <div style={{ marginTop: 8, color: positive ? "#34d399" : "#f87171", fontSize: 13, fontWeight: 600 }}>
                        {positive ? "+" : ""}
                        {data?.change_pct?.toFixed(2) || "0.00"}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside style={{ ...panelStyle, padding: 22 }}>
            <div style={{ ...sectionEyebrow, marginBottom: 16 }}>Economic Indicators</div>
            <div style={{ display: "grid", gap: 12 }}>
              {INDICATORS.map((indicator) => (
                <div
                  key={indicator.label}
                  style={{
                    padding: 18,
                    borderRadius: 18,
                    border: "1px solid rgba(148,163,184,0.08)",
                    background: "rgba(4,9,20,0.66)",
                  }}
                >
                  <div style={{ color: "#64748b", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {indicator.label}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 20, fontWeight: 700, color: "#f8fafc" }}>{indicator.value}</div>
                  <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>{indicator.note}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(320px, 0.95fr) minmax(540px, 1.55fr) minmax(260px, 0.75fr);
          gap: 20px;
          align-items: start;
        }

        @media (max-width: 1320px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          body {
            overflow-x: hidden;
          }
        }

        @media (max-width: 760px) {
          .dashboard-grid {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
