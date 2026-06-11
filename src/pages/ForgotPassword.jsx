import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/studentService";
import "./ForgotPassword.css";

// Two steps:
// STEP 1 — student enters email + regNo
// STEP 2 — show success message with temp password from backend
const STEP_INPUT   = "input";
const STEP_SUCCESS = "success";

export default function ForgotPassword() {
  const [step,     setStep]     = useState(STEP_INPUT);
  const [email,    setEmail]    = useState("");
  const [regNo,    setRegNo]    = useState("");
  const [tempPass, setTempPass] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  // ─── Validation ──────────────────────────────────────
  const validate = () => {
    if (!email.trim())               return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address.";
    if (!regNo.trim())               return "Register Number is required.";
    return null;
  };

  // ─── Submit ──────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      // ✅ Calls POST /api/students/forgot-password
      // Backend verifies email + regNo and returns { tempPassword, message }
      const res = await forgotPassword(email, regNo);
      const temp = res.data?.tempPassword || res.data?.message;
      setTempPass(temp);
      setStep(STEP_SUCCESS);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No account found with this email and register number.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Allow submit on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        {/* ─── Step 1: Input Form ─── */}
        {step === STEP_INPUT && (
          <>
            <div className="forgot-icon">🔑</div>
            <h2 className="forgot-title">Forgot Password?</h2>
            <p className="forgot-subtitle">
              Enter your registered email and register number. We'll verify your
              account and show you your password.
            </p>

            {error && (
              <div className="alert alert-danger py-2 text-center">
                {error}
              </div>
            )}

            <input
              type="email"
              className="form-control mb-2"
              placeholder="Registered Email *"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Register Number *"
              value={regNo}
              onChange={(e) => { setRegNo(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
            />

            <button
              className="forgot-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify My Account"}
            </button>

            <div className="forgot-links">
              <Link to="/student-login">← Back to Student Login</Link>
              <span className="divider">|</span>
              <Link to="/">Home</Link>
            </div>
          </>
        )}

        {/* ─── Step 2: Success ─── */}
        {step === STEP_SUCCESS && (
          <>
            <div className="forgot-icon">✅</div>
            <h2 className="forgot-title">Account Verified!</h2>
            <p className="forgot-subtitle">
              Your account has been found. Here is your temporary password:
            </p>

            {/* ✅ Temp password display box */}
            <div className="temp-password-box">
              <span className="temp-password-label">Temporary Password</span>
              <span className="temp-password-value">{tempPass}</span>
            </div>

            <div className="forgot-warning">
              ⚠️ Please login and change your password immediately after accessing
              your account.
            </div>

            <Link to="/student-login" className="forgot-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
              Go to Login →
            </Link>

            <button
              className="forgot-btn-secondary"
              onClick={() => { setStep(STEP_INPUT); setEmail(""); setRegNo(""); setTempPass(""); }}
            >
              Try Again
            </button>
          </>
        )}

      </div>
    </div>
  );
}