import api from "./api";

// ─── AUTH ─────────────────────────────────────────────
// ✅ Fixed: wrong endpoint /admin/login → /students/admin
// ✅ Fixed: wrong field 'username' → 'email'
export const adminLogin = (email, password) =>
  api.post("/students/admin", { email, password });

// ─── STUDENT CRUD ─────────────────────────────────────
export const addStudent = (student) =>
  api.post("/students", student);

export const getStudents = () =>
  api.get("/students");

export const getStudentByRegNo = (regNo) =>
  api.get(`/students/${regNo}`);

export const getStudentById = (id) =>
  api.get(`/students/id/${id}`);

// ✅ Fixed: matches backend PUT /api/students/update/:regNo
export const updateStudent = (regNo, student) =>
  api.put(`/students/update/${regNo}`, student);

export const deleteStudent = (id) =>
  api.delete(`/students/${id}`);

// ✅ New: Search students by name or regNo
export const searchStudents = (query) =>
  api.get(`/students/search?query=${query}`);

// ─── MARKS CRUD ───────────────────────────────────────
export const addMarks = (marks) =>
  api.post("/marks", marks);

export const getMarks = () =>
  api.get("/marks");

export const getMarksByRegNo = (regNo) =>
  api.get(`/marks/regno/${regNo}`);

// ✅ New: Update marks — matches backend PUT /api/marks/regno/:regNo
export const updateMarks = (regNo, marks) =>
  api.put(`/marks/regno/${regNo}`, marks);

// ✅ New: Delete marks by regNo
export const deleteMarks = (regNo) =>
  api.delete(`/marks/regno/${regNo}`);

// ─── ANALYTICS ────────────────────────────────────────
// ✅ New: Fetch mark analytics for dashboard charts
export const getAnalytics = () =>
  api.get("/marks/analytics");