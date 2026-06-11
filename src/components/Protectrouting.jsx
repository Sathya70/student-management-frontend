import { Navigate } from "react-router-dom";

// ─── ADMIN PROTECTED ROUTE ────────────────────────────
// Checks for admin token in localStorage
// If not logged in → redirect to /admin-login
export function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

// ─── STUDENT PROTECTED ROUTE ─────────────────────────
// Checks for student token in localStorage
// If not logged in → redirect to /student-login
export function StudentProtectedRoute({ children }) {
  const token = localStorage.getItem("studentToken");

  if (!token) {
    return <Navigate to="/student-login" replace />;
  }

  return children;
}