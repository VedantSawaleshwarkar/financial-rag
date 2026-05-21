import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isAuthenticated, collapsed = false }) {
  const location = useLocation();
  const [online, setOnline] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "DS" },
    { path: "/advisor", label: "Advisor", icon: "AI" },
    { path: "/portfolio", label: "Portfolio", icon: "PF" },
    { path: "/market", label: "Market", icon: "MK" },
    { path: "/top-stocks", label: "Top 30", icon: "T30" },
    { path: "/learn", label: "Learn", icon: "LN" },
  ];

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:8000/test");
        setOnline(response.ok);
      } catch {
        setOnline(false);
      }
    };

    if (isAuthenticated) {
      checkBackend();
      const interval = setInterval(checkBackend, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <div
      style={{
        width: collapsed ? "92px" : "250px",
        background: "linear-gradient(180deg, rgba(2,8,23,0.98), rgba(2,8,23,0.92))",
        borderRight: "1px solid rgba(148,163,184,0.12)",
        padding: "18px 14px",
        fontFamily: "'IBM Plex Mono','Courier New',monospace",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 900,
        transition: "width 0.18s ease",
        overflow: "hidden",
        boxShadow: "18px 0 40px rgba(2,6,23,0.22)",
      }}
    >
      <div style={{ marginBottom: "30px", padding: "0 8px" }}>
        <div style={{ fontSize: "14px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "0.16em", marginBottom: "6px" }}>
          <span style={{ color: "#10b981" }}>FIN</span>
          {!collapsed && "AI RAG"}
        </div>
        {!collapsed && (
          <div style={{ fontSize: "9px", color: "#64748b", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Terminal · India
          </div>
        )}
      </div>

      <div
        style={{
          marginBottom: "22px",
          padding: collapsed ? "12px 10px" : "12px",
          background: "rgba(15,23,42,0.72)",
          border: "1px solid rgba(148,163,184,0.1)",
          borderRadius: "16px",
        }}
      >
        {!collapsed && (
          <div style={{ fontSize: "9px", color: "#64748b", letterSpacing: "0.14em", marginBottom: "8px", textTransform: "uppercase" }}>
            BACKEND STATUS
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: online ? "#10b981" : "#ef4444",
              boxShadow: online ? "0 0 8px rgba(16,185,129,0.5)" : "0 0 8px rgba(239,68,68,0.5)",
            }}
          />
          {!collapsed && (
            <div style={{ fontSize: "10px", color: online ? "#10b981" : "#ef4444", fontWeight: "600" }}>
              {online ? "ONLINE" : "OFFLINE"}
            </div>
          )}
        </div>
      </div>

      {!collapsed && (
        <div style={{ fontSize: "9px", color: "#64748b", letterSpacing: "0.14em", marginBottom: "14px", padding: "0 8px", textTransform: "uppercase" }}>
          Navigation
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: "none",
              color: location.pathname === item.path ? "#d1fae5" : "#94a3b8",
              background:
                location.pathname === item.path
                  ? "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(14,165,233,0.1))"
                  : "rgba(15,23,42,0.32)",
              padding: collapsed ? "12px 10px" : "12px 16px",
              borderRadius: "14px",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: "12px",
              fontSize: "10px",
              fontWeight: "500",
              letterSpacing: "0.08em",
              border: location.pathname === item.path ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(148,163,184,0.08)",
            }}
            title={collapsed ? item.label : undefined}
          >
            <div
              style={{
                fontSize: "10px",
                opacity: 0.9,
                minWidth: collapsed ? 0 : 28,
                textAlign: "center",
                padding: collapsed ? 0 : "5px 0",
                borderRadius: 8,
                background: collapsed ? "transparent" : "rgba(2,6,23,0.32)",
              }}
            >
              {item.icon}
            </div>
            {!collapsed && item.label}
          </Link>
        ))}
      </div>

      {!collapsed && (
        <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
          <div style={{ fontSize: "8px", color: "#64748b", letterSpacing: "0.12em", textAlign: "center", opacity: 0.7, textTransform: "uppercase" }}>
            v1.0.0 · AUTH TERMINAL
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
