import { BrowserRouter, Routes, Route } from "react-router-dom";

// ─── Route Protection ──────────────────────────────────
import { AdminProtectedRoute, StudentProtectedRoute } from "./components/Protectrouting";

// ─── Public Pages ──────────────────────────────────────
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";
import ForgotPassword from "./pages/ForgotPassword";

// ─── Admin Pages ───────────────────────────────────────
import AdminDashboard from "./pages/AdminDashboard";
import AddStudent from "./pages/AddStudent";
import AddMarks from "./pages/AddMarks";
import ViewStudents from "./pages/ViewStudents";
import ViewMarks from "./pages/ViewMarks";
import UpdateStudent from "./pages/UpdateStudent";
import EditMarks from "./pages/EditMarks";
import MarkAnalytics from "./pages/MarkAnalytics";

// ─── Student Pages ─────────────────────────────────────
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public Routes (no login needed) ── */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ── Admin Routes (login required) ── */}
        <Route path="/admin-dashboard" element={
          <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
        } />
        <Route path="/admin/add-student" element={
          <AdminProtectedRoute><AddStudent /></AdminProtectedRoute>
        } />
        <Route path="/admin/add-marks" element={
          <AdminProtectedRoute><AddMarks /></AdminProtectedRoute>
        } />
        <Route path="/admin/view-students" element={
          <AdminProtectedRoute><ViewStudents /></AdminProtectedRoute>
        } />
        <Route path="/admin/view-marks" element={
          <AdminProtectedRoute><ViewMarks /></AdminProtectedRoute>
        } />
        <Route path="/admin/update-student/:id" element={
          <AdminProtectedRoute><UpdateStudent /></AdminProtectedRoute>
        } />
        {/* ✅ New: Edit Marks route */}
        <Route path="/admin/edit-marks/:regNo" element={
          <AdminProtectedRoute><EditMarks /></AdminProtectedRoute>
        } />
        {/* ✅ New: Analytics Dashboard route */}
        <Route path="/admin/analytics" element={
          <AdminProtectedRoute><MarkAnalytics /></AdminProtectedRoute>
        } />

        {/* ── Student Routes (login required) ── */}
        <Route path="/student/dashboard" element={
          <StudentProtectedRoute><StudentDashboard /></StudentProtectedRoute>
        } />
        {/* ✅ New: Student Profile route */}
        <Route path="/student/profile" element={
          <StudentProtectedRoute><StudentProfile /></StudentProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}