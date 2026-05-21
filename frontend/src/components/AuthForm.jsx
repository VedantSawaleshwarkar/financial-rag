import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const shellStyles = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(16,185,129,0.12), transparent 28%), radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 24%), #020817",
  color: "#e2e8f0",
  fontFamily: "'IBM Plex Mono','Courier New',monospace",
  display: "grid",
  placeItems: "center",
  padding: "28px",
};

function AuthForm({ mode = "login" }) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const isSignup = mode === "signup";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    if (isSignup && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        await signup({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
      }

      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={shellStyles}>
      <div
        style={{
          width: "100%",
          maxWidth: 1080,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 24,
        }}
        className="auth-layout"
      >
        <section
          style={{
            padding: "34px",
            borderRadius: 28,
            border: "1px solid rgba(148,163,184,0.12)",
            background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(5,10,21,0.95))",
            boxShadow: "0 24px 60px rgba(2,6,23,0.42)",
          }}
        >
          <div style={{ color: "#10b981", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
            FinAI RAG Access
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.05 }}>
            {isSignup ? "Create your terminal account" : "Welcome back to the terminal"}
          </h1>
          <p style={{ margin: 0, color: "#94a3b8", maxWidth: 560, fontSize: 14, lineHeight: 1.75 }}>
            {isSignup
              ? "Create a local account to unlock the dashboard, advisor, portfolio tracker, and market workspace."
              : "Log in to continue into your market dashboard and AI advisor environment."}
          </p>

          <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
            {[
              "Live dashboard with market source status",
              "AI advisor access with graceful fallback mode",
              "Portfolio and market views inside the same shell",
            ].map((point) => (
              <div
                key={point}
                style={{
                  padding: "14px 16px",
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.08)",
                  background: "rgba(2,6,23,0.42)",
                  color: "#cbd5e1",
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                {point}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: "30px",
            borderRadius: 28,
            border: "1px solid rgba(148,163,184,0.12)",
            background: "rgba(15,23,42,0.8)",
            boxShadow: "0 24px 60px rgba(2,6,23,0.42)",
          }}
        >
          <div style={{ fontSize: 11, color: "#7c8aa5", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
            {isSignup ? "Signup" : "Login"}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
            {isSignup && (
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  placeholder="Your display name"
                  style={inputStyles}
                />
              </label>
            )}

            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="name@example.com"
                style={inputStyles}
              />
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                placeholder="Enter your password"
                style={inputStyles}
              />
            </label>

            {isSignup && (
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Confirm Password</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                  placeholder="Repeat your password"
                  style={inputStyles}
                />
              </label>
            )}

            {error && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(248,113,113,0.24)",
                  background: "rgba(127,29,29,0.18)",
                  color: "#fca5a5",
                  fontSize: 11,
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: "13px 16px",
                borderRadius: 14,
                border: "1px solid rgba(16,185,129,0.35)",
                background: loading ? "rgba(15,23,42,0.72)" : "linear-gradient(135deg, #10b981, #1d4ed8)",
                color: "#fff",
                fontFamily: "inherit",
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Processing..." : isSignup ? "Create Account" : "Login"}
            </button>
          </form>

          <div style={{ marginTop: 18, color: "#94a3b8", fontSize: 12, lineHeight: 1.7 }}>
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              style={{ color: "#38bdf8", textDecoration: "none" }}
            >
              {isSignup ? "Log in here" : "Create one here"}
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

const inputStyles = {
  background: "rgba(2,6,23,0.65)",
  border: "1px solid rgba(148,163,184,0.16)",
  borderRadius: 14,
  color: "#e2e8f0",
  padding: "12px 14px",
  fontSize: 12,
  fontFamily: "'IBM Plex Mono','Courier New',monospace",
  outline: "none",
};

export default AuthForm;
