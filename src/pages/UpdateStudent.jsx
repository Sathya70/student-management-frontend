import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentById, updateStudent } from "../services/adminService";
import NavbarAdmin from "../components/NavbarAdmin";
import "./UpdateStudent.css";

export default function UpdateStudent() {
  const { id }              = useParams();   // ✅ Read :id from URL
  const navigate            = useNavigate();

  const [student, setStudent] = useState(null);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  // ✅ Auto-fetch student on mount using id from URL
  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const res = await getStudentById(id);
        setStudent(res.data);
      } catch {
        setError("Student not found. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // ✅ Validation
  const validate = () => {
    if (!student.name?.trim())         return "Name is required.";
    if (!student.age || student.age <= 0 || student.age > 100)
                                       return "Enter a valid age (1–100).";
    if (!student.studentClass?.trim()) return "Class is required.";
    if (!student.email?.trim())        return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(student.email))
                                       return "Enter a valid email address.";
    return null;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSaving(true);
    try {
      // ✅ Uses adminService — matches PUT /api/students/update/:regNo
      await updateStudent(student.regNo, student);
      setSuccess("Student updated successfully! ✅");
      setTimeout(() => navigate("/admin/view-students"), 1500);
    } catch {
      setError("Failed to update student. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading state ───────────────────────────────────
  if (loading) return (
    <>
      <NavbarAdmin />
      <div className="update-container">
        <p className="state-msg">Loading student data...</p>
      </div>
    </>
  );

  // ─── Error state (student not found) ────────────────
  if (error && !student) return (
    <>
      <NavbarAdmin />
      <div className="update-container">
        <p className="state-msg error">{error}</p>
        <button className="btn btn-secondary mt-3"
          onClick={() => navigate("/admin/view-students")}>
          ← Back to Students
        </button>
      </div>
    </>
  );

  return (
    <>
      <NavbarAdmin />

      <div className="update-container">
        <div className="update-card shadow">
          <h2 className="update-title">✏️ Update Student</h2>

          {/* ✅ Inline feedback */}
          {error   && <div className="alert alert-danger  py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <p className="reg-display">
            <b>Reg No:</b> {student.regNo}
            <span className="reg-note">(cannot be changed)</span>
          </p>

          <form onSubmit={handleUpdate}>
            {[
              { label: "Name",    name: "name",         type: "text"     },
              { label: "Age",     name: "age",          type: "number"   },
              { label: "Class",   name: "studentClass", type: "text"     },
              { label: "Email",   name: "email",        type: "email"    },
              { label: "Address", name: "address",      type: "text"     },
              // ✅ Fixed: type="password" instead of type="text"
              { label: "New Password (leave blank to keep current)",
                                  name: "password",     type: "password" },
            ].map(({ label, name, type }) => (
              <div className="mb-3" key={name}>
                <label className="form-label">{label}</label>
                <input
                  type={type}
                  name={name}
                  className="form-control"
                  value={student[name] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="update-actions">
              <button
                type="submit"
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Student"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/view-students")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}