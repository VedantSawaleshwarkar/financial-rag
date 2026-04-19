import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [online, setOnline] = useState(false);
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "DASHBOARD" },
    { path: "/advisor", label: "Advisor", icon: "ADVISOR" },
    { path: "/portfolio", label: "Portfolio", icon: "PORTFOLIO" },
    { path: "/market", label: "Market", icon: "MARKET" },
    { path: "/learn", label: "Learn", icon: "LEARN" },
  ];

  useEffect(() => {
    // Check backend status
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/test');
        setOnline(response.ok);
      } catch {
        setOnline(false);
      }
    };
    
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Don't show sidebar on home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div style={{
      width: "250px",
      background: "#020817",
      borderRight: "1px solid #1e293b",
      padding: "20px",
      fontFamily: "'IBM Plex Mono','Courier New',monospace",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 900
    }}>
      {/* Logo Section */}
      <div style={{
        marginBottom: "40px"
      }}>
        <div style={{
          fontSize: "14px",
          fontWeight: "800",
          color: "#f1f5f9",
          letterSpacing: "2px",
          marginBottom: "4px"
        }}>
          <span style={{ color: "#10b981" }}>FIN</span>AI RAG
        </div>
        <div style={{
          fontSize: "9px",
          color: "#334155",
          letterSpacing: "1.5px"
        }}>
          TERMINAL · INDIA
        </div>
      </div>

      {/* Status Indicator */}
      <div style={{
        marginBottom: "30px",
        padding: "12px",
        background: "rgba(13,17,23,0.8)",
        border: "1px solid #1e293b",
        borderRadius: "8px"
      }}>
        <div style={{
          fontSize: "9px",
          color: "#334155",
          letterSpacing: "1.5px",
          marginBottom: "8px"
        }}>
          BACKEND STATUS
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: online ? "#10b981" : "#ef4444",
            boxShadow: online ? "0 0 8px rgba(16,185,129,0.5)" : "0 0 8px rgba(239,68,68,0.5)"
          }} />
          <div style={{
            fontSize: "10px",
            color: online ? "#10b981" : "#ef4444",
            fontWeight: "600"
          }}>
            {online ? "ONLINE" : "OFFLINE"}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{
        fontSize: "9px",
        color: "#334155",
        letterSpacing: "1.5px",
        marginBottom: "16px"
      }}>
        NAVIGATION
      </div>
      
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px"
      }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: "none",
              color: location.pathname === item.path ? "#10b981" : "#475569",
              background: location.pathname === item.path ? "rgba(16,185,129,0.1)" : "transparent",
              padding: "12px 16px",
              borderRadius: "6px",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "10px",
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
            <div style={{
              fontSize: "8px",
              opacity: 0.7
            }}>
              {item.icon}
            </div>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        right: "20px"
      }}>
        <div style={{
          fontSize: "8px",
          color: "#334155",
          letterSpacing: "1px",
          textAlign: "center",
          opacity: 0.7
        }}>
          v1.0.0 · RAG TERMINAL
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
