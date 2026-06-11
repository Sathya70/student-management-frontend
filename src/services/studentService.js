import api from "./api";

// ─── AUTH ─────────────────────────────────────────────
// ✅ Fixed: removed raw fetch + hardcoded BASE_URL
// ✅ JWT token automatically attached via api.js interceptor
export const studentLogin = (email, regNo, password) =>
  api.post("/students/login", { email, regNo, password });

// ✅ New: Forgot password — verify email + regNo
export const forgotPassword = (email, regNo) =>
  api.post("/students/forgot-password", { email, regNo });

// ─── STUDENT PROFILE ──────────────────────────────────
// ✅ New: Get student profile by regNo (for Student Profile page)
export const getStudentProfile = (regNo) =>
  api.get(`/students/${regNo}`);

// ─── MARKS ────────────────────────────────────────────
// ✅ Fixed: removed raw fetch, removed console.log, uses api.js
export const getMarksByRegNo = (regNo) =>
  api.get(`/marks/regno/${regNo}`);