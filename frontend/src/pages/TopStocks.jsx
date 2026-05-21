import { useEffect, useState } from "react";

const API_CANDIDATES = ["http://localhost:8000", "http://localhost:8010"];

const FALLBACK_TOP_STOCKS = [
  ["Reliance Industries", "RELIANCE.NS", "Energy", 1],
  ["TCS", "TCS.NS", "IT", 2],
  ["HDFC Bank", "HDFCBANK.NS", "Banking", 3],
  ["ICICI Bank", "ICICIBANK.NS", "Banking", 4],
  ["Infosys", "INFY.NS", "IT", 5],
  ["ITC", "ITC.NS", "FMCG", 6],
  ["State Bank of India", "SBIN.NS", "Banking", 7],
  ["Bharti Airtel", "BHARTIARTL.NS", "Telecom", 8],
  ["Larsen & Toubro", "LT.NS", "Infrastructure", 9],
  ["Kotak Mahindra Bank", "KOTAKBANK.NS", "Banking", 10],
  ["Hindustan Unilever", "HINDUNILVR.NS", "FMCG", 11],
  ["Axis Bank", "AXISBANK.NS", "Banking", 12],
  ["Asian Paints", "ASIANPAINT.NS", "Consumer", 13],
  ["Maruti Suzuki", "MARUTI.NS", "Auto", 14],
  ["Sun Pharma", "SUNPHARMA.NS", "Pharma", 15],
  ["UltraTech Cement", "ULTRACEMCO.NS", "Cement", 16],
  ["Bajaj Finance", "BAJFINANCE.NS", "NBFC", 17],
  ["NTPC", "NTPC.NS", "Power", 18],
  ["Power Grid", "POWERGRID.NS", "Power", 19],
  ["Titan Company", "TITAN.NS", "Retail", 20],
  ["Nestle India", "NESTLEIND.NS", "FMCG", 21],
  ["Bajaj Finserv", "BAJAJFINSV.NS", "Financials", 22],
  ["Wipro", "WIPRO.NS", "IT", 23],
  ["HCL Technologies", "HCLTECH.NS", "IT", 24],
  ["Tech Mahindra", "TECHM.NS", "IT", 25],
  ["Tata Motors", "TATAMOTORS.NS", "Auto", 26],
  ["JSW Steel", "JSWSTEEL.NS", "Metals", 27],
  ["Adani Enterprises", "ADANIENT.NS", "Conglomerate", 28],
  ["ONGC", "ONGC.NS", "Energy", 29],
  ["Coal India", "COALINDIA.NS", "Mining", 30],
].map(([name, symbol, sector, rank], index) => {
  const price = Number((420 + index * 57.35).toFixed(2));
  const changePct = Number((3.4 - index * 0.17).toFixed(2));
  const previousClose = Number((price / Math.max(1 + changePct / 100, 0.01)).toFixed(2));
  return {
    rank,
    name,
    symbol,
    sector,
    price,
    change: Number((price - previousClose).toFixed(2)),
    change_pct: changePct,
    open: Number((price - 4.2).toFixed(2)),
    high: Number((price + 8.6).toFixed(2)),
    low: Number((price - 9.8).toFixed(2)),
    volume: 400000 + index * 135000,
    source: "mock",
    last_updated: new Date().toISOString(),
  };
});

function formatVolume(value) {
  if (!value) {
    return "0";
  }
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    return `${(value / 100000).toFixed(2)}L`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

function TopStocks() {
  const [items, setItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [marketStatus, setMarketStatus] = useState("CLOSED");
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        let data = null;

        for (const baseUrl of API_CANDIDATES) {
          try {
            const response = await fetch(`${baseUrl}/top-stocks?limit=30`);
            if (!response.ok) {
              continue;
            }

            data = await response.json();
            break;
          } catch {
            continue;
          }
        }

        if (!data) {
          throw new Error("Failed to fetch top stocks");
        }

        setItems(data.items || []);
        setMarketStatus(data.market_status || "CLOSED");
        setDemoMode(false);
        setLastUpdated(
          new Date(data.last_updated).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch (error) {
        console.error("Failed to fetch top stocks:", error);
        setItems(FALLBACK_TOP_STOCKS);
        setMarketStatus("CLOSED");
        setDemoMode(true);
        setLastUpdated(
          new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopStocks();
    const interval = setInterval(fetchTopStocks, 300000);
    return () => clearInterval(interval);
  }, []);

  const liveCount = items.filter((item) => item.source === "live").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        marginLeft: "var(--app-shell-offset, 250px)",
        padding: "28px",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.12), transparent 24%), radial-gradient(circle at top right, rgba(16,185,129,0.1), transparent 24%), #020817",
        color: "#e2e8f0",
        fontFamily: "'IBM Plex Mono','Courier New',monospace",
      }}
    >
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <section
          style={{
            padding: 24,
            borderRadius: 24,
            border: "1px solid rgba(148,163,184,0.12)",
            background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(8,15,30,0.88))",
            boxShadow: "0 24px 60px rgba(2,6,23,0.42)",
            marginBottom: 22,
          }}
        >
          <div style={{ color: "#7c8aa5", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
            Market Movers
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.05 }}>Top 30 stocks of the day</h1>
              <p style={{ margin: "12px 0 0", color: "#94a3b8", fontSize: 14, lineHeight: 1.7, maxWidth: 720 }}>
                A ranked view of a curated large-cap Indian stock universe, sorted by daily percentage move.
              </p>
            </div>

            <div
              style={{
                minWidth: 280,
                padding: 18,
                borderRadius: 18,
                border: "1px solid rgba(148,163,184,0.12)",
                background: "rgba(2,6,23,0.42)",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <div>
                <div style={{ color: "#64748b", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Updated</div>
                <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700 }}>{lastUpdated || "--:--"}</div>
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Market</div>
                <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, color: marketStatus === "OPEN" ? "#34d399" : "#f87171" }}>{marketStatus}</div>
              </div>
              <div>
                <div style={{ color: "#64748b", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Live Feed</div>
                <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, color: "#38bdf8" }}>{liveCount}/30</div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: 22,
            borderRadius: 24,
            border: "1px solid rgba(148,163,184,0.12)",
            background: "linear-gradient(180deg, rgba(15,23,42,0.86), rgba(5,10,21,0.94))",
            boxShadow: "0 24px 60px rgba(2,6,23,0.32)",
          }}
        >
          {demoMode && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                borderRadius: 14,
                border: "1px solid rgba(251,191,36,0.28)",
                background: "rgba(251,191,36,0.1)",
                color: "#fbbf24",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Demo mode: showing fallback ranking until the updated backend route is live
            </div>
          )}

          <div style={{ color: "#7c8aa5", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
            Ranked Table
          </div>

          {loading ? (
            <div
              style={{
                minHeight: 320,
                display: "grid",
                placeItems: "center",
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Loading top 30 stocks...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
                <thead>
                  <tr>
                    {["Rank", "Stock", "Sector", "Price", "Change", "Day Range", "Volume", "Source"].map((header) => (
                      <th
                        key={header}
                        style={{
                          textAlign: "left",
                          padding: "0 14px 8px",
                          color: "#64748b",
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const positive = item.change_pct >= 0;
                    return (
                      <tr key={item.symbol}>
                        <td style={cellStyle}>
                          <div style={rankBadgeStyle}>{item.rank}</div>
                        </td>
                        <td style={cellStyle}>
                          <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 700 }}>{item.name}</div>
                          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>{item.symbol}</div>
                        </td>
                        <td style={cellStyle}>{item.sector}</td>
                        <td style={cellStyle}>{item.price?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                        <td style={cellStyle}>
                          <div style={{ color: positive ? "#34d399" : "#f87171", fontWeight: 700 }}>
                            {positive ? "+" : ""}
                            {item.change_pct?.toFixed(2)}%
                          </div>
                          <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>
                            {positive ? "+" : ""}
                            {item.change?.toFixed(2)}
                          </div>
                        </td>
                        <td style={cellStyle}>
                          <div>{item.low?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
                          <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                            {item.high?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </div>
                        </td>
                        <td style={cellStyle}>{formatVolume(item.volume)}</td>
                        <td style={cellStyle}>
                          <div
                            style={{
                              display: "inline-flex",
                              padding: "6px 10px",
                              borderRadius: 999,
                              border: `1px solid ${item.source === "live" ? "rgba(56,189,248,0.32)" : "rgba(251,191,36,0.28)"}`,
                              background: item.source === "live" ? "rgba(56,189,248,0.12)" : "rgba(251,191,36,0.12)",
                              color: item.source === "live" ? "#38bdf8" : "#fbbf24",
                              fontSize: 10,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                            }}
                          >
                            {item.source}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const cellStyle = {
  padding: "14px",
  background: "rgba(2,6,23,0.42)",
  borderTop: "1px solid rgba(148,163,184,0.08)",
  borderBottom: "1px solid rgba(148,163,184,0.08)",
  color: "#cbd5e1",
  fontSize: 12,
};

const rankBadgeStyle = {
  width: 34,
  height: 34,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  background: "rgba(16,185,129,0.16)",
  color: "#10b981",
  fontWeight: 700,
};

export default TopStocks;
