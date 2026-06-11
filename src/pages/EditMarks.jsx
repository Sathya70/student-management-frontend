import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMarksByRegNo, updateMarks } from "../services/adminService";
import NavbarAdmin from "../components/NavbarAdmin";
import "./EditMarks.css";

const subjects = ["tamil", "english", "maths", "science", "social"];

// ✅ Grade logic — mirrors Marks.java backend calculation
const getGrade = (avg) => {
  if (avg >= 90) return { grade: "A+", color: "#2e7d32" };
  if (avg >= 80) return { grade: "A",  color: "#388e3c" };
  if (avg >= 70) return { grade: "B+", color: "#1565c0" };
  if (avg >= 60) return { grade: "B",  color: "#1976d2" };
  if (avg >= 50) return { grade: "C",  color: "#f57c00" };
  return           { grade: "D",  color: "#c62828" };
};

export default function EditMarks() {
  const { regNo }           = useParams();   // ✅ Read :regNo from URL
  const navigate            = useNavigate();

  const [marks,   setMarks]   = useState(null);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  // ─── Auto-fetch existing marks on mount ─────────────
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        // ✅ Calls GET /api/marks/regno/:regNo
        const res = await getMarksByRegNo(regNo);
        setMarks(res.data);
      } catch {
        setError("Marks not found for this Register Number.");
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [regNo]);

  const handleChange = (e) => {
    setMarks({ ...marks, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // ─── Live calculation ────────────────────────────────
  const allFilled = marks && subjects.every((s) => marks[s] !== "" && marks[s] !== null);
  const total     = allFilled
    ? subjects.reduce((sum, s) => sum + Number(marks[s]), 0)
    : null;
  const average   = total !== null ? (total / 5).toFixed(1) : null;
  const gradeInfo = average !== null ? getGrade(Number(average)) : null;

  // ─── Validation ──────────────────────────────────────
  const validate = () => {
    for (const s of subjects) {
      const val = Number(marks[s]);
      if (marks[s] === "" || marks[s] === null)
        return `${s.charAt(0).toUpperCase() + s.slice(1)} mark is required.`;
      if (val < 0 || val > 100)
        return `${s.charAt(0).toUpperCase() + s.slice(1)} must be between 0 and 100.`;
    }
    return null;
  };

  // ─── Submit ──────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSaving(true);
    try {
      // ✅ Calls PUT /api/marks/regno/:regNo
      await updateMarks(regNo, marks);
      setSuccess("Marks updated successfully! ✅");
      setTimeout(() => navigate("/admin/view-marks"), 1500);
    } catch {
      setError("Failed to update marks. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading state ───────────────────────────────────
  if (loading) return (
    <>
      <NavbarAdmin />
      <div className="edit-marks-container">
        <p className="state-msg">Loading marks...</p>
      </div>
    </>
  );

  // ─── Error state (marks not found) ──────────────────
  if (error && !marks) return (
    <>
      <NavbarAdmin />
      <div className="edit-marks-container">
        <p className="state-msg error">{error}</p>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/admin/view-marks")}
        >
          ← Back to Marks
        </button>
      </div>
    </>
  );

  return (
    <>
      <NavbarAdmin />

      <div className="edit-marks-container">
        <div className="edit-marks-card">
          <h2 className="edit-marks-title">✏️ Edit Marks</h2>

          {/* ✅ RegNo display — not editable */}
          <div className="regno-display">
            <b>Register Number:</b> {regNo}
            <span className="regno-note">(cannot be changed)</span>
          </div>

          {/* ✅ Inline feedback */}
          {error   && <div className="alert alert-danger  py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleUpdate}>
            {subjects.map((subject) => (
              <div className="mb-3" key={subject}>
                <label className="form-label subject-label">
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </label>
                <input
                  type="number"
                  name={subject}
                  className="form-control"
                  min="0"
                  max="100"
                  value={marks[subject] ?? ""}
                  onChange={handleChange}
                  placeholder="0 – 100"
                />
              </div>
            ))}

            {/* ✅ Live preview — matches AddMarks style */}
            {allFilled && gradeInfo && (
              <div className="marks-preview">
                <div className="preview-item">
                  <span className="preview-label">Total</span>
                  <span className="preview-value">{total} / 500</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Average</span>
                  <span className="preview-value">{average}%</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Grade</span>
                  <span
                    className="preview-value"
                    style={{ color: gradeInfo.color }}
                  >
                    {gradeInfo.grade}
                  </span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Result</span>
                  <span className={`badge-result ${Number(average) >= 50 ? "pass" : "fail"}`}>
                    {Number(average) >= 50 ? "Pass" : "Fail"}
                  </span>
                </div>
              </div>
            )}

            <div className="edit-marks-actions">
              <button
                type="submit"
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Marks"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/view-marks")}
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