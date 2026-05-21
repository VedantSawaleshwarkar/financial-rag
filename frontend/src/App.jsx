import { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Advisor from "./pages/Advisor";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Login from "./pages/Login";
import Market from "./pages/Market";
import Portfolio from "./pages/Portfolio";
import Signup from "./pages/Signup";
import TopStocks from "./pages/TopStocks";

function AppShell() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem("finai-rag-sidebar-collapsed");
    setSidebarCollapsed(storedValue === "true");
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const nextValue = !prev;
      window.localStorage.setItem("finai-rag-sidebar-collapsed", JSON.stringify(nextValue));
      return nextValue;
    });
  };

  const onAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const shellOffset = isAuthenticated && !onAuthPage ? (sidebarCollapsed ? "92px" : "250px") : "0px";

  return (
    <div style={{ minHeight: "100vh", background: "#020817", "--app-shell-offset": shellOffset }}>
      <Navbar
        isAuthenticated={isAuthenticated}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
      <Sidebar isAuthenticated={isAuthenticated} collapsed={sidebarCollapsed} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor"
          element={
            <ProtectedRoute>
              <Advisor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          }
        />
        <Route
          path="/top-stocks"
          element={
            <ProtectedRoute>
              <TopStocks />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}

export default App;
