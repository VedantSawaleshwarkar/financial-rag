import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "🏠 Dashboard", icon: "🏠" },
    { path: "/about", label: "📖 About", icon: "📖" },
    { path: "/features", label: "⚡ Features", icon: "⚡" },
    { path: "/docs", label: "📚 Documentation", icon: "📚" }
  ];

  return (
    <nav style={{
      background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
      padding: "1rem 2rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "white",
            background: "rgba(255,255,255,0.1)",
            padding: "0.5rem 1rem",
            borderRadius: "8px"
          }}>
            🤖 FinAI RAG
          </div>
          <div style={{
            color: "#d1d5db",
            fontSize: "0.9rem"
          }}>
            Financial Intelligence System
          </div>
        </div>
        
        <div style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center"
        }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                color: location.pathname === item.path ? "#ffffff" : "#d1d5db",
                background: location.pathname === item.path ? "rgba(255,255,255,0.2)" : "transparent",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1rem",
                fontWeight: "500"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = location.pathname === item.path 
                  ? "rgba(255,255,255,0.3)" 
                  : "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = location.pathname === item.path 
                  ? "rgba(255,255,255,0.2)" 
                  : "transparent";
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
