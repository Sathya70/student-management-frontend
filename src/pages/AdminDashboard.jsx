import { Link } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import "./AdminDashboard.css";

// ✅ Dashboard menu cards config
const menuCards = [
  {
    title: "Add Student",
    description: "Register a new student into the system",
    icon: "➕",
    to: "/admin/add-student",
    color: "#1565c0",
    bg: "#e3f2fd",
  },
  {
    title: "View Students",
    description: "Browse, search and manage all students",
    icon: "👥",
    to: "/admin/view-students",
    color: "#2e7d32",
    bg: "#e8f5e9",
  },
  {
    title: "Add Marks",
    description: "Enter subject marks for a student",
    icon: "📝",
    to: "/admin/add-marks",
    color: "#6a1b9a",
    bg: "#f3e5f5",
  },
  {
    title: "View Marks",
    description: "View, edit and export all student marks",
    icon: "📊",
    to: "/admin/view-marks",
    color: "#e65100",
    bg: "#fff3e0",
  },
  {
    title: "Analytics",
    description: "Charts for pass/fail rate and subject averages",
    icon: "📈",
    to: "/admin/analytics",
    color: "#00695c",
    bg: "#e0f2f1",
  },
];

export default function AdminDashboard() {
  return (
    <>
      {/* ✅ Fixed: NavbarAdmin now rendered */}
      <NavbarAdmin />

      <div className="admin-dashboard-container">
        <h2 className="dashboard-title">Welcome, Admin 👋</h2>
        <p className="dashboard-subtitle">What would you like to do today?</p>

        <div className="dashboard-grid">
          {menuCards.map((card) => (
            // ✅ Fixed: <Link> instead of <a> — no full page reload
            <Link to={card.to} key={card.title} className="dashboard-card-link">
              <div className="dashboard-card" style={{ borderTop: `4px solid ${card.color}`, background: card.bg }}>
                <div className="dashboard-card-icon">{card.icon}</div>
                <div className="dashboard-card-title" style={{ color: card.color }}>
                  {card.title}
                </div>
                <div className="dashboard-card-desc">{card.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}