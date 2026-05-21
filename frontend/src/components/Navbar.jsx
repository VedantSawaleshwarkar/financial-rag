import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ isAuthenticated, sidebarCollapsed, onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/advisor", label: "Advisor" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/market", label: "Market" },
    { path: "/top-stocks", label: "Top 30" },
    { path: "/learn", label: "Learn" },
  ];

  if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((chunk) => chunk[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "FR";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav
      style={{
        background: "linear-gradient(180deg, rgba(2,8,23,0.96), rgba(2,8,23,0.88))",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(148,163,184,0.12)",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        fontFamily: "'IBM Plex Mono','Courier New',monospace",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                border: "1px solid rgba(148,163,184,0.14)",
                background: "rgba(15,23,42,0.76)",
                color: "#cbd5e1",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 15,
                boxShadow: "0 10px 24px rgba(2,6,23,0.24)",
              }}
              title={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              {sidebarCollapsed ? "»" : "«"}
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "0.2em" }}>
              <span style={{ color: "#10b981" }}>FIN</span>AI RAG
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#7c8aa5",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.1)",
                background: "rgba(15,23,42,0.6)",
              }}
            >
              Terminal
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {isAuthenticated &&
            navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: location.pathname === item.path ? "#d1fae5" : "#7c8aa5",
                  background: location.pathname === item.path ? "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(14,165,233,0.12))" : "transparent",
                  padding: "9px 14px",
                  borderRadius: "12px",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "11px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  border: location.pathname === item.path ? "1px solid rgba(16,185,129,0.45)" : "1px solid transparent",
                }}
              >
                {item.label}
              </Link>
            ))}

          {isAuthenticated && currentUser && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 16,
                  border: "1px solid rgba(148,163,184,0.12)",
                  background: "rgba(15,23,42,0.78)",
                  boxShadow: "0 10px 24px rgba(2,6,23,0.18)",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg,#0f766e,#1d4ed8)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#f8fafc", fontSize: 11, fontWeight: 700 }}>{currentUser.name}</div>
                  <div style={{ color: "#64748b", fontSize: 10 }}>{currentUser.email}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(127,29,29,0.18)",
                  border: "1px solid rgba(248,113,113,0.24)",
                  color: "#fca5a5",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "inherit",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
