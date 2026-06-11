import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMarks } from "../services/adminService";
import NavbarAdmin from "../components/NavbarAdmin";
import "./AddMarks.css";

const emptyForm = {
  regNo:   "",
  maths:   "",
  science: "",
  social:  "",
  tamil:   "",
  english: "",
};

const subjects = ["maths", "science", "social", "tamil", "english"];

// ✅ Calculate grade from average
const getGrade = (avg) => {
  if (avg >= 90) return { grade: "A+", color: "#2e7d32" };
  if (avg >= 80) return { grade: "A",  color: "#388e3c" };
  if (avg >= 70) return { grade: "B+", color: "#1565c0" };
  if (avg >= 60) return { grade: "B",  color: "#1976d2" };
  if (avg >= 50) return { grade: "C",  color: "#f57c00" };
  return           { grade: "D",  color: "#c62828" };
};

export default function AddMarks() {
  const [marks,   setMarks]   = useState(emptyForm);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleChange = (e) => {
    setMarks({ ...marks, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // ✅ Live calculation
  const filled   = subjects.filter((s) => marks[s] !== "");
  const allFilled = filled.length === 5;
  const total    = allFilled
    ? subjects.reduce((sum, s) => sum + Number(marks[s]), 0)
    : null;
  const average  = total !== null ? (total / 5).toFixed(1) : null;
  const gradeInfo = average !== null ? getGrade(Number(average)) : null;

  // ✅ Validation
  const validate = () => {
    if (!marks.regNo.trim()) return "Register Number is required.";
    for (const s of subjects) {
      const val = Number(marks[s]);
      if (marks[s] === "")       return `${s.charAt(0).toUpperCase() + s.slice(1)} mark is required.`;
      if (val < 0 || val > 100)  return `${s.charAt(0).toUpperCase() + s.slice(1)} must be between 0 and 100.`;
    }
    return null;
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      await addMarks(marks);
      setSuccess("Marks added successfully! ✅");
      setMarks(emptyForm);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Marks already exist for this Register Number. Use Edit Marks instead.");
      } else {
        setError("Failed to add marks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Fixed: NavbarAdmin now rendered */}
      <NavbarAdmin />

      <div className="add-marks-page">
        <div className="add-marks-card">
          <h3>📝 Add Marks</h3>

          {error   && <div className="alert alert-danger  py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <input
            className="form-control mb-2"
            placeholder="Register Number *"
            name="regNo"
            value={marks.regNo}
            onChange={handleChange}
          />

          {subjects.map((subject) => (
            <input
              key={subject}
              type="number"
              className="form-control mb-2"
              placeholder={`${subject.charAt(0).toUpperCase() + subject.slice(1)} (0–100) *`}
              name={subject}
              min="0"
              max="100"
              value={marks[subject]}
              onChange={handleChange}
            />
          ))}

          {/* ✅ Live preview */}
          {allFilled && gradeInfo && (
            <div className="marks-preview">
              <span>Total: <b>{total}</b></span>
              <span>Average: <b>{average}</b></span>
              <span>Grade: <b style={{ color: gradeInfo.color }}>{gradeInfo.grade}</b></span>
            </div>
          )}

          <div className="marks-actions">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Marks"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/admin-dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}