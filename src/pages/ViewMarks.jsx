import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMarks, deleteMarks } from "../services/adminService";
import NavbarAdmin from "../components/NavbarAdmin";
import "./ViewMarks.css";

// ✅ Grade color mapping
const gradeColor = {
  "A+": "#2e7d32", A: "#388e3c",
  "B+": "#1565c0", B: "#1976d2",
  C:   "#f57c00", D: "#c62828",
};

export default function ViewMarks() {
  const [marks,   setMarks]   = useState([]);
  const [query,   setQuery]   = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const navigate              = useNavigate();

  // ─── Load all marks ──────────────────────────────────
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMarks();
      setMarks(res.data);
    } catch {
      setError("Failed to load marks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ─── Delete marks ────────────────────────────────────
  const handleDelete = async (regNo) => {
    if (!window.confirm(`Delete marks for ${regNo}?`)) return;
    try {
      await deleteMarks(regNo);
      setMarks((prev) => prev.filter((m) => m.regNo !== regNo));
    } catch {
      alert("Failed to delete marks.");
    }
  };

  // ─── Real-time filter by regNo ───────────────────────
  const filtered = marks.filter((m) =>
    m.regNo?.toLowerCase().includes(query.toLowerCase())
  );

  // ─── Export PDF via browser print ───────────────────
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <>
      {/* ✅ Fixed: NavbarAdmin now rendered */}
      <NavbarAdmin />

      <div className="view-marks-container">

        {/* ─── Header ─── */}
        <div className="view-marks-header no-print">
          <div>
            <h3 className="view-title">📊 Marks List</h3>
            {!loading && (
              <span className="marks-count">
                {filtered.length} of {marks.length} record{marks.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="view-marks-actions">
            {/* ✅ Search by regNo */}
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search by Reg No..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* ✅ Export PDF button */}
            <button className="btn-export" onClick={handleExportPDF}>
              🖨️ Export PDF
            </button>
          </div>
        </div>

        {/* ─── States ─── */}
        {loading && <p className="state-msg">Loading marks...</p>}
        {error   && <p className="state-msg error">{error}</p>}

        {/* ─── Table ─── */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <p className="state-msg">
                {query ? `No marks found for "${query}".` : "No marks added yet."}
              </p>
            ) : (
              <div className="table-wrapper">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Reg No</th>
                      <th>Tamil</th>
                      <th>English</th>
                      <th>Maths</th>
                      <th>Science</th>
                      <th>Social</th>
                      <th>Total</th>
                      <th>Average</th>
                      <th>Grade</th>
                      <th>Result</th>
                      <th className="no-print">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m, index) => {
                      const pass = m.average >= 50;
                      return (
                        <tr key={m.id}>
                          <td>{index + 1}</td>
                          <td><b>{m.regNo}</b></td>
                          <td>{m.tamil}</td>
                          <td>{m.english}</td>
                          <td>{m.maths}</td>
                          <td>{m.science}</td>
                          <td>{m.social}</td>
                          <td><b>{m.total}</b></td>
                          <td>{m.average}</td>
                          {/* ✅ Grade with color */}
                          <td>
                            <span style={{
                              color: gradeColor[m.grade] || "#333",
                              fontWeight: 700,
                            }}>
                              {m.grade}
                            </span>
                          </td>
                          {/* ✅ Pass/Fail badge */}
                          <td>
                            <span className={`badge-result ${pass ? "pass" : "fail"}`}>
                              {pass ? "Pass" : "Fail"}
                            </span>
                          </td>
                          {/* ✅ Edit + Delete actions */}
                          <td className="no-print">
                            <button
                              className="btn-update me-2"
                              onClick={() => navigate(`/admin/edit-marks/${m.regNo}`)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(m.regNo)}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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