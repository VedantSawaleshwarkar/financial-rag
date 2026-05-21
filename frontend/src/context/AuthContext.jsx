import { createContext, useContext, useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";
const TOKEN_KEY = "finai-rag-token";
const USER_KEY  = "finai-rag-user";

const AuthContext = createContext(null);

// ── Helpers ──────────────────────────────────────────────────────────────────

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true); // hydrating from storage

  // On mount: restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user  = readLocal(USER_KEY, null);
    if (token && user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const persistSession = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const signup = async ({ name, email, password }) => {
    const data = await apiPost("/auth/signup", { name, email, password });
    persistSession(data.token, data.user);
  };

  const login = async ({ email, password }) => {
    const data = await apiPost("/auth/login", { email, password });
    persistSession(data.token, data.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
  };

  // Helper so other parts of the app can send authenticated requests
  const authFetch = (path, options = {}) => {
    const token = localStorage.getItem(TOKEN_KEY);
    return fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    sessionLoading: loading,
    login,
    signup,
    logout,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
