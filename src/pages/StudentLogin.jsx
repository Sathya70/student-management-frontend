import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { studentLogin } from "../services/studentService";
import "./StudentLogin.css";

export default function StudentLogin() {
  const [email, setEmail]       = useState("");
  const [regNo, setRegNo]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleLogin = async () => {
    setError("");

    // ✅ Frontend validation before API call
    if (!email || !regNo || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await studentLogin(email, regNo, password);
      const data = res.data;

      // ✅ Store ONLY safe fields — never store password
      // Once backend sends JWT, data.token will have a real value
      localStorage.setItem("studentToken", data?.token || "student-logged-in");
      localStorage.setItem("regNo", data?.regNo || regNo);
      localStorage.setItem("studentName", data?.name || "");

      navigate("/student/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email, register number, or password.");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h3 className="login-title">🎓 Student Login</h3>

        {/* ✅ Inline error message */}
        {error && (
          <div className="alert alert-danger py-2 text-center" role="alert">
            {error}
          </div>
        )}

        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          className="form-control mb-2"
          placeholder="Registration Number"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* ✅ Forgot password link */}
        <p className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p className="back-home-link">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}