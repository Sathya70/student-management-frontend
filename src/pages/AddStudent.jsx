import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStudent } from "../services/adminService";
import NavbarAdmin from "../components/NavbarAdmin";
import "./AddStudent.css";

const emptyForm = {
  regNo:        "",
  name:         "",
  age:          "",
  studentClass: "",
  email:        "",
  address:      "",
  password:     "",
};

export default function AddStudent() {
  const [student, setStudent] = useState(emptyForm);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // ✅ Frontend validation
  const validate = () => {
    if (!student.regNo.trim())        return "Register Number is required.";
    if (!student.name.trim())         return "Name is required.";
    if (!student.age || student.age <= 0 || student.age > 100)
                                      return "Enter a valid age (1–100).";
    if (!student.studentClass.trim()) return "Class is required.";
    if (!student.email.trim())        return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(student.email))
                                      return "Enter a valid email address.";
    if (!student.password.trim())     return "Password is required.";
    if (student.password.length < 6)  return "Password must be at least 6 characters.";
    return null;
  };

  const saveStudent = async () => {
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // ✅ Uses adminService — no hardcoded URL, JWT auto-attached
      await addStudent(student);
      setSuccess("Student added successfully! ✅");
      setStudent(emptyForm); // ✅ Reset form
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Register Number already exists.");
      } else {
        setError("Failed to add student. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ NavbarAdmin now rendered */}
      <NavbarAdmin />

      <div className="add-student-container">
        <div className="add-student-card">
          <h2 className="add-title">➕ Add Student</h2>

          {/* ✅ Inline feedback messages */}
          {error   && <div className="alert alert-danger  py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <input
            type="text"
            name="regNo"
            placeholder="Register Number *"
            value={student.regNo}
            onChange={handleChange}
            className="add-input"
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={student.name}
            onChange={handleChange}
            className="add-input"
          />
          <input
            type="number"
            name="age"
            placeholder="Age *"
            value={student.age}
            onChange={handleChange}
            className="add-input"
          />
          <input
            type="text"
            name="studentClass"
            placeholder="Class *"
            value={student.studentClass}
            onChange={handleChange}
            className="add-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={student.email}
            onChange={handleChange}
            className="add-input"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={student.address}
            onChange={handleChange}
            className="add-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password * (min 6 characters)"
            value={student.password}
            onChange={handleChange}
            className="add-input"
          />

          <div className="add-actions">
            <button
              onClick={saveStudent}
              className="add-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Student"}
            </button>

            <button
              onClick={() => navigate("/admin-dashboard")}
              className="add-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}