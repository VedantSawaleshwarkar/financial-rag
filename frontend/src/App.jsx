import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Advisor from "./pages/Advisor";
import Portfolio from "./pages/Portfolio";
import Learn from "./pages/Learn";
import Market from "./pages/Market";

function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "#020817" }}>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/advisor" element={<Advisor />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/market" element={<Market />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
