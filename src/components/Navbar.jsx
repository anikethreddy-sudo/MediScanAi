import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("result");
    navigate("/login");
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#2563EB" : "#FFFFFF",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "18px",
    transition: "0.3s",
  });

  return (
    <nav
      style={{
        background: "linear-gradient(90deg,#0F172A,#1E3A8A)",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 6px 20px rgba(37,99,235,.25)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div>
        <h2
          style={{
            color: "white",
            margin: 0,
            fontSize: "32px",
            fontWeight: "800",
          }}
        >
          🩺 MediScan AI
        </h2>
        <p
          style={{
            color: "#BFDBFE",
            margin: 0,
            fontSize: "13px",
          }}
        >
          Intelligent Medical Platform
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "26px",
        }}
      >
        <Link to="/" style={linkStyle("/")}>Home</Link>
        <Link to="/upload" style={linkStyle("/upload")}>Upload</Link>
        <Link to="/results" style={linkStyle("/results")}>Results</Link>
        <Link to="/history" style={linkStyle("/history")}>History</Link>
        <Link to="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>

        <button
          onClick={logout}
          style={{
            background: "#FFFFFF",
            color: "#1D4ED8",
            border: "none",
            padding: "10px 18px",
            borderRadius: "12px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}