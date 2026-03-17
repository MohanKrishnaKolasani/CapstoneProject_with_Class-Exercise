import React, { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BRAND_COLOR = "#7e0404";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
  const errors = {};
  if (!email.trim())               errors.email = "Email address is required.";
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = "Enter a valid email address.";
  if (!password)                   errors.password = "Password is required.";
  else if (password.length < 6)    errors.password = "Password must be at least 6 characters.";
  return errors;
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ color: BRAND_COLOR, fontSize: "0.78rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BRAND_COLOR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </div>
  );
}

function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);

  const set = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const blur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(form)[field] }));
  };

  const inputClass = (field) =>
    `form-control${touched[field] && errors[field] ? " is-invalid" : touched[field] && !errors[field] ? " is-valid" : ""}`;

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");
    setTouched({ email: true, password: true });
    const allErrors = validate(form);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setLoading(true);
    try {
      const res  = await loginUser({ email: form.email.trim(), password: form.password });
      const role = res.data.user.role.toLowerCase();
      login(res.data.token, role);
      navigate(role === "admin" ? "/admin" : "/songs");
    } catch (err) {
      const msg = err.response?.data?.message;
      setApiError(msg || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: THEME_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        <div className="text-center mb-4">
          <div style={{ width: "64px", height: "64px", background: BRAND_COLOR, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <h2 className="fw-bold mb-1" style={{ color: BRAND_COLOR }}>Music Library</h2>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Sign in to your account</p>
        </div>

        <div className="p-4 rounded-3 shadow-sm" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(0,0,0,0.07)" }}>
          {apiError && (
            <div className="mb-3 p-3 rounded-2 text-center" style={{ background: "rgba(126,4,4,0.08)", color: BRAND_COLOR, fontSize: "0.875rem" }}>
              {apiError}
            </div>
          )}
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#555", fontSize: "0.875rem" }}>Email Address</label>
              <input type="email" className={inputClass("email")} placeholder="name@example.com" value={form.email} onChange={set("email")} onBlur={blur("email")} />
              <FieldError msg={touched.email && errors.email} />
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ color: "#555", fontSize: "0.875rem" }}>Password</label>
              <input type="password" className={inputClass("password")} placeholder="••••••••" value={form.password} onChange={set("password")} onBlur={blur("password")} />
              <FieldError msg={touched.password && errors.password} />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: "6px", padding: "10px", fontWeight: "500", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, transition: "opacity 0.2s" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <div className="text-center mt-3" style={{ fontSize: "0.875rem", color: "#666" }}>
              New here?{" "}
              <Link to="/register" style={{ color: BRAND_COLOR, fontWeight: "500", textDecoration: "none" }}>Create an account</Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
