import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";

const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BRAND_COLOR = "#7e0404";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10,15}$/;

function validate({ name, email, phone, password }) {
  const errors = {};
  if (!name.trim())
    errors.name = "Full name is required.";
  else if (name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";

  if (!email.trim())
    errors.email = "Email address is required.";
  else if (!EMAIL_REGEX.test(email.trim()))
    errors.email = "Enter a valid email address (e.g. user@example.com).";

  if (!phone.trim())
    errors.phone = "Phone number is required.";
  else if (!PHONE_REGEX.test(phone.trim()))
    errors.phone = "Phone must be 10–15 digits with no spaces or symbols.";

  if (!password)
    errors.password = "Password is required.";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters.";

  return errors;
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ color: BRAND_COLOR, fontSize: "0.78rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BRAND_COLOR}
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </div>
  );
}

function Register() {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

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
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const inputClass = (field) =>
    `form-control${touched[field] && errors[field] ? " is-invalid" : touched[field] && !errors[field] ? " is-valid" : ""}`;

  const handleRegister = async (e) => {
    e.preventDefault();
    setApiError("");
    setTouched({ name: true, email: true, phone: true, password: true });
    const allErrors = validate(form);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setLoading(true);
    try {
      await registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password, phone: form.phone.trim() });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message;
      setApiError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: THEME_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        <div className="text-center mb-4">
          <div style={{ width: "64px", height: "64px", background: BRAND_COLOR, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <h2 className="fw-bold mb-1" style={{ color: BRAND_COLOR }}>Create Account</h2>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Join the Music Library</p>
        </div>

        <div className="p-4 rounded-3 shadow-sm" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(0,0,0,0.07)" }}>

          {apiError && (
            <div className="alert alert-danger py-2 px-3 text-center mb-3" style={{ fontSize: "0.875rem" }} role="alert">
              {apiError}
            </div>
          )}
          {success && (
            <div className="alert alert-success py-2 px-3 text-center mb-3" style={{ fontSize: "0.875rem" }} role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} noValidate>

            <div className="mb-3">
              <label className="form-label" style={{ color: "#555", fontSize: "0.875rem" }}>Full Name</label>
              <input
                type="text"
                className={inputClass("name")}
                placeholder="Enter your full name"
                value={form.name}
                onChange={set("name")}
                onBlur={blur("name")}
              />
              <FieldError msg={touched.name && errors.name} />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ color: "#555", fontSize: "0.875rem" }}>Email Address</label>
              <input
                type="email"
                className={inputClass("email")}
                placeholder="name@example.com"
                value={form.email}
                onChange={set("email")}
                onBlur={blur("email")}
              />
              <FieldError msg={touched.email && errors.email} />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ color: "#555", fontSize: "0.875rem" }}>Phone Number</label>
              <input
                type="tel"
                className={inputClass("phone")}
                placeholder="10–15 digit number"
                value={form.phone}
                onChange={set("phone")}
                onBlur={blur("phone")}
                maxLength={15}
              />
              <FieldError msg={touched.phone && errors.phone} />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ color: "#555", fontSize: "0.875rem" }}>Password</label>
              <input
                type="password"
                className={inputClass("password")}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={set("password")}
                onBlur={blur("password")}
              />
              <FieldError msg={touched.password && errors.password} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: "6px", padding: "10px", fontWeight: "500", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, transition: "opacity 0.2s" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="text-center mt-3" style={{ fontSize: "0.875rem", color: "#666" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: BRAND_COLOR, fontWeight: "500", textDecoration: "none" }}>
                Sign in
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Register;