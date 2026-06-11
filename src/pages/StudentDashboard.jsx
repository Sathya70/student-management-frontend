import { useEffect, useState } from "react";
import { getMarksByRegNo } from "../services/studentService";
import NavbarStudent from "../components/NavbarStudent";
import "./StudentDashboard.css";

// ✅ Grade color mapping — matches backend grading logic
const gradeColor = {
  "A+": "#2e7d32", A:  "#388e3c",
  "B+": "#1565c0", B:  "#1976d2",
  C:   "#f57c00",  D:  "#c62828",
};

const subjects = [
  { label: "Tamil",   key: "tamil"   },
  { label: "English", key: "english" },
  { label: "Maths",   key: "maths"   },
  { label: "Science", key: "science" },
  { label: "Social",  key: "social"  },
];

export default function StudentDashboard() {
  const [marks,   setMarks]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // ✅ Fixed: only reads "regNo" — matches what StudentLogin now stores
  const regNo       = localStorage.getItem("regNo");
  const studentName = localStorage.getItem("studentName") || "Student";

  useEffect(() => {
    if (!regNo) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    const fetchMarks = async () => {
      try {
        const res = await getMarksByRegNo(regNo);
        setMarks(res.data);
      } catch {
        setError("No marks found. Please contact your admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [regNo]);

  // ✅ Print marks card as PDF
  const handlePrint = () => window.print();

  const pass = marks?.average >= 50;

  return (
    <>
      {/* ✅ NavbarStudent now rendered */}
      <NavbarStudent />

      <div className="dashboard-page">
        <div className="dashboard-card">

          {/* ─── Header ─── */}
          <div className="dashboard-header no-print">
            <h2>📊 My Marks</h2>
            {marks && (
              <button className="btn-print" onClick={handlePrint}>
                🖨️ Print / Export PDF
              </button>
            )}
          </div>

          {/* ─── Print header (only shows when printing) ─── */}
          <div className="print-header">
            <h2>Student Marks Report</h2>
            <p><b>Name:</b> {studentName} &nbsp;|&nbsp; <b>Reg No:</b> {regNo}</p>
          </div>

          {/* ─── States ─── */}
          {loading && <p className="state-msg">Loading your marks...</p>}
          {error   && <p className="state-msg error">{error}</p>}

          {/* ─── Marks ─── */}
          {!loading && !error && marks && (
            <>
              {/* Subject marks */}
              <div className="marks-grid">
                {subjects.map(({ label, key }) => (
                  <div className="marks-subject-card" key={key}>
                    <div className="subject-label">{label}</div>
                    <div className="subject-score">{marks[key]}</div>
                    <div className="subject-max">/ 100</div>
                  </div>
                ))}
              </div>

              {/* Summary row */}
              <div className="marks-summary">
                <div className="summary-item">
                  <span className="summary-label">Total</span>
                  <span className="summary-value">{marks.total} / 500</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Average</span>
                  {/* ✅ Fixed: marks.average instead of marks.avg */}
                  <span className="summary-value">{marks.average}%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Grade</span>
                  <span
                    className="summary-value"
                    style={{ color: gradeColor[marks.grade] || "#333" }}
                  >
                    {marks.grade}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Result</span>
                  <span className={`badge-result ${pass ? "pass" : "fail"}`}>
                    {pass ? "✅ Pass" : "❌ Fail"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}