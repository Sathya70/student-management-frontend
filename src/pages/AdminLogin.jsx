import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../services/adminService";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleAdminLogin = async () => {
    setError("");

    // ✅ Frontend validation before API call
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(email, password);

      // ✅ Store JWT token — used by AdminProtectedRoute
      // Backend returns { token, message } — adjust if your backend differs
      const token = res.data?.token || "admin-logged-in";
      localStorage.setItem("adminToken", token);

      navigate("/admin-dashboard");
    } catch (err) {
      // ✅ Show error inline instead of alert()
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Allow login on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdminLogin();
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2 className="admin-title">🔐 Admin Login</h2>

        {/* ✅ Inline error message */}
        {error && (
          <div className="alert alert-danger py-2 text-center" role="alert">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="admin-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="admin-input"
        />

        <button
          onClick={handleAdminLogin}
          className="admin-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="admin-back">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}