import { useState, useEffect } from "react";

const API = "http://localhost:8000";

const MOCK_PORTFOLIO = [
  { name: "NIFTY 50 ETF", buyPrice: 18500, quantity: 10, symbol: "NIFTY50" },
  { name: "RELIANCE INDUSTRIES", buyPrice: 2850, quantity: 50, symbol: "RELIANCE" },
  { name: "TCS", buyPrice: 3650, quantity: 25, symbol: "TCS" },
  { name: "HDFC BANK", buyPrice: 1680, quantity: 100, symbol: "HDFCBANK" },
  { name: "GOLD ETF", buyPrice: 68000, quantity: 2, symbol: "GOLD" },
];

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(MOCK_PORTFOLIO);
  const [marketData, setMarketData] = useState({});
  const [online, setOnline] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [newStock, setNewStock] = useState({ name: "", buyPrice: "", quantity: "" });

  // Mock market data
  const mockMarketData = {
    NIFTY50: { price: 19750.25, change_pct: 0.85 },
    RELIANCE: { price: 2925.50, change_pct: 2.65 },
    TCS: { price: 3785.75, change_pct: 3.72 },
    HDFCBANK: { price: 1725.25, change_pct: 2.68 },
    GOLD: { price: 72850.00, change_pct: 1.25 },
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch(`${API}/market`);
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
        setOnline(true);
        setDemoMode(false);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      setMarketData(mockMarketData);
      setOnline(false);
      setDemoMode(true);
    }
  };

  const calculatePnL = (stock) => {
    const currentPrice = marketData[stock.symbol]?.price || stock.buyPrice;
    const invested = stock.buyPrice * stock.quantity;
    const currentValue = currentPrice * stock.quantity;
    const pnl = currentValue - invested;
    const pnlPercent = ((pnl / invested) * 100);
    return { pnl, pnlPercent, currentValue };
  };

  const calculateTotalPortfolio = () => {
    return portfolio.reduce((total, stock) => {
      const { currentValue } = calculatePnL(stock);
      return total + currentValue;
    }, 0);
  };

  const calculateTotalPnL = () => {
    return portfolio.reduce((total, stock) => {
      const { pnl } = calculatePnL(stock);
      return total + pnl;
    }, 0);
  };

  const addStock = () => {
    if (newStock.name && newStock.buyPrice && newStock.quantity) {
      const stock = {
        name: newStock.name,
        buyPrice: parseFloat(newStock.buyPrice),
        quantity: parseInt(newStock.quantity),
        symbol: newStock.name.toUpperCase().replace(/\s+/g, "")
      };
      setPortfolio([...portfolio, stock]);
      setNewStock({ name: "", buyPrice: "", quantity: "" });
    }
  };

  const removeStock = (index) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const totalValue = calculateTotalPortfolio();
  const totalPnL = calculateTotalPnL();
  const totalPnLPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;

  // Prepare data for pie chart
  const pieChartData = portfolio.map(stock => {
    const { currentValue } = calculatePnL(stock);
    return {
      name: stock.name,
      value: currentValue,
      percentage: (currentValue / totalValue) * 100
    };
  });

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
          <span style={{ color: "#10b981" }}>PORTFOLIO</span> TRACKER
        </h1>
        <div style={{
          fontSize: "12px",
          color: "#94a3b8",
          letterSpacing: "1px"
        }}>
          Real-time P&L tracking for your investments
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{
        padding: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        <div style={{
          background: "rgba(13,17,23,0.8)",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{
            fontSize: "10px",
            color: "#334155",
            letterSpacing: "1.5px",
            marginBottom: "8px"
          }}>
            TOTAL PORTFOLIO VALUE
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#f1f5f9",
            fontFamily: "monospace"
          }}>
            {totalValue.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
          </div>
        </div>

        <div style={{
          background: "rgba(13,17,23,0.8)",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{
            fontSize: "10px",
            color: "#334155",
            letterSpacing: "1.5px",
            marginBottom: "8px"
          }}>
            TOTAL P&L
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: totalPnL >= 0 ? "#10b981" : "#ef4444",
            fontFamily: "monospace"
          }}>
            {totalPnL >= 0 ? "+" : ""}{totalPnL.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
          </div>
          <div style={{
            fontSize: "12px",
            color: totalPnL >= 0 ? "#10b981" : "#ef4444",
            marginTop: "4px"
          }}>
            ({totalPnLPercent >= 0 ? "+" : ""}{totalPnLPercent.toFixed(2)}%)
          </div>
        </div>

        <div style={{
          background: "rgba(13,17,23,0.8)",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{
            fontSize: "10px",
            color: "#334155",
            letterSpacing: "1.5px",
            marginBottom: "8px"
          }}>
            HOLDINGS
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#f1f5f9",
            fontFamily: "monospace"
          }}>
            {portfolio.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: "0 20px 20px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "20px"
      }}>
        {/* Portfolio Table */}
        <div style={{
          background: "rgba(13,17,23,0.8)",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "20px"
        }}>
          <div style={{
            fontSize: "12px",
            color: "#334155",
            letterSpacing: "1.5px",
            marginBottom: "20px"
          }}>
            HOLDINGS DETAIL
          </div>
          
          <div style={{
            overflowX: "auto"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{
                  borderBottom: "1px solid #1e293b"
                }}>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "10px",
                    color: "#334155",
                    letterSpacing: "1px"
                  }}>STOCK</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "right",
                    fontSize: "10px",
                    color: "#334155",
                    letterSpacing: "1px"
                  }}>QTY</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "right",
                    fontSize: "10px",
                    color: "#334155",
                    letterSpacing: "1px"
                  }}>BUY PRICE</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "right",
                    fontSize: "10px",
                    color: "#334155",
                    letterSpacing: "1px"
                  }}>CURRENT</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "right",
                    fontSize: "10px",
                    color: "#334155",
                    letterSpacing: "1px"
                  }}>P&L</th>
                  <th style={{
                    padding: "12px",
                    textAlign: "center",
                    fontSize: "10px",
                    color: "#334155",
                    letterSpacing: "1px"
                  }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((stock, index) => {
                  const { pnl, pnlPercent, currentValue } = calculatePnL(stock);
                  const currentPrice = marketData[stock.symbol]?.price || stock.buyPrice;
                  const isPositive = pnl >= 0;
                  
                  return (
                    <tr key={index} style={{
                      borderBottom: "1px solid #1e293b"
                    }}>
                      <td style={{
                        padding: "12px",
                        fontSize: "11px",
                        color: "#f1f5f9",
                        fontFamily: "monospace"
                      }}>
                        {stock.name}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "right",
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontFamily: "monospace"
                      }}>
                        {stock.quantity}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "right",
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontFamily: "monospace"
                      }}>
                        {stock.buyPrice.toLocaleString("en-IN")}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "right",
                        fontSize: "11px",
                        color: "#f1f5f9",
                        fontFamily: "monospace"
                      }}>
                        {currentPrice.toLocaleString("en-IN")}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "right",
                        fontSize: "11px",
                        color: isPositive ? "#10b981" : "#ef4444",
                        fontFamily: "monospace",
                        fontWeight: "600"
                      }}>
                        {isPositive ? "+" : ""}{pnl.toLocaleString("en-IN")}
                        <div style={{
                          fontSize: "9px",
                          opacity: 0.8
                        }}>
                          ({isPositive ? "+" : ""}{pnlPercent.toFixed(2)}%)
                        </div>
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "center"
                      }}>
                        <button
                          onClick={() => removeStock(index)}
                          style={{
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            color: "#ef4444",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "9px",
                            cursor: "pointer",
                            fontFamily: "monospace"
                          }}
                        >
                          REMOVE
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Stock & Pie Chart */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {/* Add Stock Form */}
          <div style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "20px"
          }}>
            <div style={{
              fontSize: "12px",
              color: "#334155",
              letterSpacing: "1.5px",
              marginBottom: "16px"
            }}>
              ADD HOLDING
            </div>
            
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <input
                type="text"
                placeholder="Stock Name"
                value={newStock.name}
                onChange={(e) => setNewStock({...newStock, name: e.target.value})}
                style={{
                  background: "rgba(30,41,59,0.8)",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  outline: "none"
                }}
              />
              <input
                type="number"
                placeholder="Buy Price"
                value={newStock.buyPrice}
                onChange={(e) => setNewStock({...newStock, buyPrice: e.target.value})}
                style={{
                  background: "rgba(30,41,59,0.8)",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  outline: "none"
                }}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newStock.quantity}
                onChange={(e) => setNewStock({...newStock, quantity: e.target.value})}
                style={{
                  background: "rgba(30,41,59,0.8)",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  padding: "10px 12px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  outline: "none"
                }}
              />
              <button
                onClick={addStock}
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  cursor: "pointer",
                  fontFamily: "monospace"
                }}
              >
                ADD STOCK
              </button>
            </div>
          </div>

          {/* Portfolio Allocation */}
          <div style={{
            background: "rgba(13,17,23,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "20px"
          }}>
            <div style={{
              fontSize: "12px",
              color: "#334155",
              letterSpacing: "1.5px",
              marginBottom: "16px"
            }}>
              PORTFOLIO ALLOCATION
            </div>
            
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              {pieChartData.map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    fontFamily: "monospace",
                    minWidth: "120px"
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    flex: 1,
                    height: "20px",
                    background: "rgba(30,41,59,0.8)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    position: "relative"
                  }}>
                    <div style={{
                      width: `${item.percentage}%`,
                      height: "100%",
                      background: `hsl(${index * 60}, 70%, 50%)`,
                      borderRadius: "4px",
                      transition: "all 0.3s ease"
                    }} />
                  </div>
                  <div style={{
                    fontSize: "10px",
                    color: "#f1f5f9",
                    fontFamily: "monospace",
                    minWidth: "50px",
                    textAlign: "right"
                  }}>
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:#020817}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
        body{background:#020817}
      `}</style>
    </div>
  );
};

export default Portfolio;
