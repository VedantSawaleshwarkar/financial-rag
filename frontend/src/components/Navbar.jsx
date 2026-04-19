import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "DASHBOARD" },
    { path: "/advisor", label: "Advisor", icon: "ADVISOR" },
    { path: "/portfolio", label: "Portfolio", icon: "PORTFOLIO" },
    { path: "/market", label: "Market", icon: "MARKET" },
    { path: "/learn", label: "Learn", icon: "LEARN" },
  ];

  // Don't show navbar on home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav style={{
      background: "#020817",
      borderBottom: "1px solid #1e293b",
      padding: "0 20px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      fontFamily: "'IBM Plex Mono','Courier New',monospace"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "60px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{
            fontSize: "16px",
            fontWeight: "800",
            color: "#f1f5f9",
            letterSpacing: "3px"
          }}>
            <span style={{ color: "#10b981" }}>FIN</span>AI RAG
          </div>
          <div style={{
            fontSize: "10px",
            color: "#334155",
            letterSpacing: "2px"
          }}>
            TERMINAL
          </div>
        </div>
        
        <div style={{
          display: "flex",
          gap: "8px",
          alignItems: "center"
        }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                color: location.pathname === item.path ? "#10b981" : "#475569",
                background: location.pathname === item.path ? "rgba(16,185,129,0.1)" : "transparent",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                fontWeight: "500",
                letterSpacing: "1px",
                border: location.pathname === item.path ? "1px solid #10b981" : "1px solid transparent"
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.color = "#10b981";
                  e.target.style.background = "rgba(16,185,129,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.color = "#475569";
                  e.target.style.background = "transparent";
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
