import { Link, useNavigate, useLocation } from "react-router-dom";

export default function NavbarAdmin() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // ✅ Logout — clear admin token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  // ✅ Helper to highlight active nav link
  const isActive = (path) =>
    location.pathname === path ? "nav-link active fw-bold" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">

        {/* ✅ Fixed: /admin/dashboard → /admin-dashboard */}
        <Link className="navbar-brand fw-bold" to="/admin-dashboard">
          🎓 Admin Panel
        </Link>

        {/* ✅ Mobile hamburger toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">

          {/* ✅ Nav links */}
          <ul className="navbar-nav me-auto ms-3">
            <li className="nav-item">
              <Link className={isActive("/admin/add-student")} to="/admin/add-student">
                ➕ Add Student
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/admin/view-students")} to="/admin/view-students">
                👥 View Students
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/admin/add-marks")} to="/admin/add-marks">
                📝 Add Marks
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/admin/view-marks")} to="/admin/view-marks">
                📊 View Marks
              </Link>
            </li>
            {/* ✅ New: Analytics link */}
            <li className="nav-item">
              <Link className={isActive("/admin/analytics")} to="/admin/analytics">
                📈 Analytics
              </Link>
            </li>
          </ul>

          {/* ✅ New: Logout button on the right */}
          <button
            className="btn btn-outline-light btn-sm ms-auto"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>
      </div>
    </nav>
  );
}