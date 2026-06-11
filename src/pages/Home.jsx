import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">

        {/* ✅ Fixed: .webg → .webp */}
        <img
          src="./studentimage.webp"
          alt="Student Management"
          className="home-img"
          onError={(e) => {
            // ✅ Fallback if image still missing — shows a placeholder
            e.target.style.display = "none";
          }}
        />

        <h2 className="title">Student Management System</h2>
        <p className="subtitle">Choose your module to continue</p>

        <div className="button-group">
          <Link to="/admin-login" className="btn btn-dark btn-custom">
            🔐 Admin Module
          </Link>
          <Link to="/student-login" className="btn btn-primary btn-custom">
            🎓 Student Module
          </Link>
        </div>

        <p className="home-footer">
          Forgot your password?{" "}
          {/* ✅ New: link to forgot password page */}
          <Link to="/forgot-password" className="forgot-link">
            Click here
          </Link>
        </p>

      </div>
    </div>
  );
}