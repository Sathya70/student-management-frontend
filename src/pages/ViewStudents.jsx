import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents, deleteStudent } from "../services/adminService";
import NavbarAdmin from "../components/NavbarAdmin";
import "./ViewStudent.css";

export default function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [query,    setQuery]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const navigate                = useNavigate();

  // ─── Load all students ───────────────────────────────
  const loadStudents = async () => {
    setLoading(true);
    setError("");
    try {
      // ✅ Uses adminService — no hardcoded URL, JWT auto-attached
      const res = await getStudents();
      setStudents(res.data);
    } catch {
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  // ─── Delete with confirmation ────────────────────────
  const handleDelete = async (id, name) => {
    // ✅ Confirmation before delete
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmed) return;

    try {
      await deleteStudent(id);
      // ✅ Remove from local state — no need to re-fetch
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete student. Please try again.");
    }
  };

  // ─── Real-time Search & Filter ───────────────────────
  // ✅ Filters locally by name OR regNo (case-insensitive)
  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(query.toLowerCase()) ||
      s.regNo?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* ✅ Fixed: NavbarAdmin now rendered */}
      <NavbarAdmin />

      <div className="view-students-container">
        {/* ─── Header ─── */}
        <div className="view-students-header">
          <div>
            <h3 className="view-students-title">👥 Students List</h3>
            {!loading && (
              <span className="student-count">
                {filtered.length} of {students.length} student{students.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* ✅ New: Search bar */}
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search by name or reg no..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* ─── States ─── */}
        {loading && <p className="state-msg">Loading students...</p>}
        {error   && <p className="state-msg error">{error}</p>}

        {/* ─── Table ─── */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <p className="state-msg">
                {query ? `No students found for "${query}".` : "No students added yet."}
              </p>
            ) : (
              <div className="table-wrapper">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Reg No</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Email</th>
                      <th style={{ width: "180px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((stu, index) => (
                      <tr key={stu.id}>
                        <td>{index + 1}</td>
                        <td>{stu.regNo}</td>
                        <td>{stu.name}</td>
                        <td>{stu.studentClass}</td>
                        <td>{stu.email}</td>
                        <td>
                          <button
                            className="btn-update me-2"
                            onClick={() => navigate(`/admin/update-student/${stu.id}`)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(stu.id, stu.name)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}