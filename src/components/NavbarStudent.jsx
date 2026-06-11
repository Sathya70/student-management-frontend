import { Link, useNavigate, useLocation } from "react-router-dom";

export default function NavbarStudent() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Read student name stored during login
  const studentName = localStorage.getItem("studentName") || "Student";

  // ✅ Fixed: clear ALL student keys on logout
  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("regNo");
    localStorage.removeItem("studentName");
    navigate("/student-login");
  };

  // ✅ Active link helper
  const isActive = (path) =>
    location.pathname === path ? "nav-link active fw-bold" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">

        <Link className="navbar-brand fw-bold" to="/student/dashboard">
          🎓 Student Panel
        </Link>

        {/* ✅ Mobile hamburger toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#studentNavbar"
          aria-controls="studentNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="studentNavbar">

          {/* ✅ Nav links */}
          <ul className="navbar-nav me-auto ms-3">
            <li className="nav-item">
              <Link className={isActive("/student/dashboard")} to="/student/dashboard">
                📊 My Marks
              </Link>
            </li>
            {/* ✅ New: Profile link */}
            <li className="nav-item">
              <Link className={isActive("/student/profile")} to="/student/profile">
                👤 My Profile
              </Link>
            </li>
          </ul>

          {/* ✅ Student name greeting + Logout */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="navbar-text text-white">
              👋 Hello, <strong>{studentName}</strong>
            </span>
            <button
              className="btn btn-light btn-sm"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}