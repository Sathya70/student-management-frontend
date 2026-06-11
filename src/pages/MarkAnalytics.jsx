import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { getAnalytics } from "../services/adminService";
import NavbarAdmin from "../components/NavbarAdmin";
import "./MarkAnalytics.css";

// ✅ Pie chart colors — Pass = green, Fail = red
const PIE_COLORS = ["#2e7d32", "#c62828"];

// ✅ Bar chart colors per subject
const BAR_COLORS = {
  Tamil:   "#7b1fa2",
  English: "#1565c0",
  Maths:   "#c62828",
  Science: "#2e7d32",
  Social:  "#e65100",
};

export default function MarkAnalytics() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // ✅ Calls GET /api/marks/analytics → returns MarkAnalyticsDto
        const res = await getAnalytics();
        setData(res.data);
      } catch {
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <>
      <NavbarAdmin />
      <div className="analytics-container">
        <p className="state-msg">Loading analytics...</p>
      </div>
    </>
  );

  if (error) return (
    <>
      <NavbarAdmin />
      <div className="analytics-container">
        <p className="state-msg error">{error}</p>
      </div>
    </>
  );

  // ─── Pie chart data ──────────────────────────────────
  const pieData = [
    { name: "Pass", value: data.passCount },
    { name: "Fail", value: data.failCount },
  ];

  // ─── Bar chart data — matches MarkAnalyticsDto fields ─
  const barData = [
    { subject: "Tamil",   avg: parseFloat(data.avgTamil?.toFixed(1))   },
    { subject: "English", avg: parseFloat(data.avgEnglish?.toFixed(1)) },
    { subject: "Maths",   avg: parseFloat(data.avgMaths?.toFixed(1))   },
    { subject: "Science", avg: parseFloat(data.avgScience?.toFixed(1)) },
    { subject: "Social",  avg: parseFloat(data.avgSocial?.toFixed(1))  },
  ];

  return (
    <>
      <NavbarAdmin />

      <div className="analytics-container">
        <h2 className="analytics-title">📈 Mark Analytics Dashboard</h2>

        {/* ─── Stat Cards ─── */}
        <div className="stat-cards">
          {[
            { label: "Total Students", value: data.totalStudents, color: "#1565c0", bg: "#e3f2fd" },
            { label: "Passed",         value: data.passCount,     color: "#2e7d32", bg: "#e8f5e9" },
            { label: "Failed",         value: data.failCount,     color: "#c62828", bg: "#ffebee" },
            {
              label: "Pass Rate",
              value: data.totalStudents > 0
                ? `${((data.passCount / data.totalStudents) * 100).toFixed(1)}%`
                : "0%",
              color: "#e65100",
              bg: "#fff3e0",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="stat-card"
              style={{ borderTop: `4px solid ${card.color}`, background: card.bg }}
            >
              <div className="stat-value" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="stat-label">{card.label}</div>
            </div>
          ))}
        </div>

        {/* ─── Charts Row ─── */}
        <div className="charts-row">

          {/* ── Pass/Fail Pie Chart ── */}
          <div className="chart-card">
            <h4 className="chart-title">Pass vs Fail</h4>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ── Subject Averages Bar Chart ── */}
          <div className="chart-card">
            <h4 className="chart-title">Subject Averages</h4>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(val) => [`${val}`, "Average"]}
                />
                <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                  {barData.map((entry) => (
                    <Cell
                      key={entry.subject}
                      fill={BAR_COLORS[entry.subject]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* ─── Top Student Card ─── */}
        {data.topStudentName && (
          <div className="top-student-card">
            <div className="top-student-icon">🏆</div>
            <div>
              <div className="top-student-label">Top Performing Student</div>
              <div className="top-student-name">{data.topStudentName}</div>
              <div className="top-student-detail">
                Reg No: <b>{data.topStudentRegNo}</b> &nbsp;|&nbsp;
                Highest Total: <b>{data.highestTotal} / 500</b>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}