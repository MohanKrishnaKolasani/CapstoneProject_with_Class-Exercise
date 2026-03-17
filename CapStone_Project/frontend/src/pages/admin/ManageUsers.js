import React, { useState } from "react";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { UserIcon } from "../../components/common/Icons";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

const BRAND_COLOR = "#7e0404";
const SLATE       = "#4a5568";
const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";

const btnPrimary   = { background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: "6px", padding: "6px 16px", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s", fontSize: "0.82rem" };
const btnSecondary = { background: SLATE,       color: "#fff", border: "none", borderRadius: "6px", padding: "6px 16px", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s", fontSize: "0.82rem" };
const btnSm = (bg) => ({ background: bg, color: "#fff", border: "none", borderRadius: "5px", padding: "3px 10px", fontSize: "0.78rem", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s" });
const hover   = e => e.currentTarget.style.opacity = "0.82";
const unhover = e => e.currentTarget.style.opacity = "1";

const EMPTY_FORM = { name: "", email: "", phone: "", password: "", roleName: "user" };

function validate({ name, email, phone, password }) {
  const errs = {};
  if (!name.trim())               errs.name  = "Name is required.";
  if (!email.trim())              errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Enter a valid email.";
  if (!phone.trim())              errs.phone = "Phone is required.";
  else if (!/^\d{10}$/.test(phone.trim())) errs.phone = "Phone must be 10 digits.";
  if (password && password.length > 0 && password.length < 6)
    errs.password = "Password must be at least 6 characters.";
  return errs;
}

function ManageUsers() {
  const { users, loading, error, update, remove } = useAdminUsers();

  const [search,        setSearch]        = useState("");
  const [editUser,      setEditUser]      = useState(null);
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [errors,        setErrors]        = useState({});
  const [message,       setMessage]       = useState({ text: "", type: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showPassword,  setShowPassword]  = useState(false);

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({
      name:     user.name,
      email:    user.email,
      phone:    user.phone,
      password: "",
      roleName: user.roleId?.roleName || "user",
    });
    setErrors({});
    setShowPassword(false);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      name:     form.name.trim(),
      email:    form.email.trim(),
      phone:    form.phone.trim(),
      roleName: form.roleName,
    };
    if (form.password.trim()) payload.password = form.password.trim();

    try {
      await update(editUser._id, payload);
      setEditUser(null);
      showMsg(`User "${form.name.trim()}" updated successfully.`);
    } catch (err) {
      showMsg(err.response?.data?.message || "Failed to update user.", "danger");
    }
  };

  const handleDelete = async () => {
    try {
      await remove(confirmDelete._id);
      setConfirmDelete(null);
      showMsg(`User "${confirmDelete.name}" deleted.`);
    } catch {
      setConfirmDelete(null);
      showMsg("Failed to delete user.", "danger");
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );
  const pg = usePagination(filtered, 10);

  const roleBadge = (roleName) => (
    <span style={{
      background: roleName === "admin" ? "rgba(126,4,4,0.12)" : "rgba(74,85,104,0.12)",
      color:      roleName === "admin" ? BRAND_COLOR : SLATE,
      fontSize: "0.72rem", fontWeight: 600, padding: "2px 9px",
      borderRadius: "20px", textTransform: "capitalize",
    }}>
      {roleName}
    </span>
  );

  const inputCls = (field) =>
    `form-control form-control-sm${errors[field] ? " is-invalid" : ""}`;

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="d-flex align-items-center gap-2 mb-0" style={{ color: BRAND_COLOR }}>
          <UserIcon size={24} color={BRAND_COLOR} /> Manage Users
        </h2>
        <span style={{ fontSize: "0.82rem", color: "#888" }}>
          {users.length} user{users.length !== 1 ? "s" : ""} total
        </span>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} py-2 px-3 mb-3`}
          style={{ fontSize: "0.875rem" }} role="alert">
          {message.text}
        </div>
      )}
      {error && (
        <div className="alert alert-danger py-2 px-3 mb-3"
          style={{ fontSize: "0.875rem" }}>{error}</div>
      )}

      <div className="mb-3" style={{ maxWidth: 360 }}>
        <div style={{ position: "relative" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa"
            strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="form-control form-control-sm" style={{ paddingLeft: 30 }}
            placeholder="Search by name, email or phone..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5" style={{ color: BRAND_COLOR }}>
          <div className="spinner-border spinner-border-sm me-2" role="status" />
          Loading users...
        </div>
      ) : (
        <div className="rounded-3 overflow-hidden shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize: "0.875rem" }}>
              <thead style={{ background: BRAND_COLOR, color: "#fff" }}>
                <tr>
                  <th className="px-3" style={{ fontWeight: 500 }}>#</th>
                  <th style={{ fontWeight: 500 }}>Name</th>
                  <th style={{ fontWeight: 500 }}>Email</th>
                  <th style={{ fontWeight: 500 }}>Phone</th>
                  <th style={{ fontWeight: 500 }}>Role</th>
                  <th style={{ fontWeight: 500 }}>Joined</th>
                  <th className="text-end px-3" style={{ fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pg.paged.map((user, i) => (
                  <tr key={user._id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", verticalAlign: "middle" }}>
                    <td className="px-3" style={{ color: "#aaa" }}>{i + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">

                        <div style={{
                          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                          background: user.roleId?.roleName === "admin"
                            ? "rgba(126,4,4,0.12)" : "rgba(74,85,104,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.8rem", fontWeight: 700,
                          color: user.roleId?.roleName === "admin" ? BRAND_COLOR : SLATE,
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-bold" style={{ color: "#222" }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "#555" }}>{user.email}</td>
                    <td style={{ color: "#555" }}>{user.phone}</td>
                    <td>{roleBadge(user.roleId?.roleName || "user")}</td>
                    <td style={{ color: "#aaa", fontSize: "0.78rem" }}>
                      {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="text-end px-3">
                      <div className="d-flex justify-content-end gap-2">
                        <button style={btnSm(BRAND_COLOR)} onMouseEnter={hover} onMouseLeave={unhover}
                          onClick={() => openEdit(user)}>Edit</button>
                        <button style={btnSm(SLATE)} onMouseEnter={hover} onMouseLeave={unhover}
                          onClick={() => setConfirmDelete(user)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-4" style={{ color: "#aaa" }}>
                      No users found{search ? ` matching "${search}"` : ""}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Pagination {...pg} />

      {editUser && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border-0 shadow">

              <div className="modal-header border-0 pb-0 pt-3 px-4">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: 38, height: 38, borderRadius: "50%",
                    background: "rgba(126,4,4,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", fontWeight: 700, color: BRAND_COLOR }}>
                    {editUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold" style={{ color: BRAND_COLOR }}>Edit User</h5>
                    <small style={{ color: "#aaa" }}>{editUser.email}</small>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                <div className="modal-body px-4 py-3">
                  <div className="row g-3">

                    <div className="col-12">
                      <label className="form-label mb-1" style={{ fontSize: "0.8rem", color: "#555" }}>
                        Full Name <span style={{ color: BRAND_COLOR }}>*</span>
                      </label>
                      <input className={inputCls("name")} value={form.name}
                        onChange={e => handleChange("name", e.target.value)}
                        placeholder="Enter full name" />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label mb-1" style={{ fontSize: "0.8rem", color: "#555" }}>
                        Email Address <span style={{ color: BRAND_COLOR }}>*</span>
                      </label>
                      <input type="email" className={inputCls("email")} value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                        placeholder="Enter email address" />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-1" style={{ fontSize: "0.8rem", color: "#555" }}>
                        Phone <span style={{ color: BRAND_COLOR }}>*</span>
                      </label>
                      <input type="tel" className={inputCls("phone")} value={form.phone}
                        onChange={e => handleChange("phone", e.target.value)}
                        placeholder="10-digit phone" maxLength={10} />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-1" style={{ fontSize: "0.8rem", color: "#555" }}>
                        Role
                      </label>
                      <select className="form-select form-select-sm" value={form.roleName}
                        onChange={e => handleChange("roleName", e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label mb-1" style={{ fontSize: "0.8rem", color: "#555" }}>
                        New Password
                        <span style={{ color: "#aaa", fontWeight: 400, marginLeft: 6 }}>
                          (leave blank to keep current)
                        </span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className={inputCls("password")}
                          value={form.password}
                          onChange={e => handleChange("password", e.target.value)}
                          placeholder="Min 6 characters"
                          style={{ paddingRight: 36 }}
                        />

                        <button type="button" onClick={() => setShowPassword(p => !p)}
                          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer", padding: 0, color: "#aaa" }}>
                          {showPassword ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <div style={{ color: BRAND_COLOR, fontSize: "0.78rem", marginTop: 3 }}>
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0 px-4 pb-3 gap-2">
                  <button type="button" style={btnSecondary} onMouseEnter={hover} onMouseLeave={unhover}
                    onClick={() => setEditUser(null)}>Cancel</button>
                  <button type="submit" style={btnPrimary} onMouseEnter={hover} onMouseLeave={unhover}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: BRAND_COLOR }}>Delete User</h5>
              </div>
              <div className="modal-body">
                <p className="mb-1">Are you sure you want to delete:</p>
                <div className="p-2 rounded-2" style={{ background: THEME_BG }}>
                  <strong>{confirmDelete.name}</strong>
                  <span style={{ color: "#888", fontSize: "0.82rem", marginLeft: 8 }}>
                    {confirmDelete.email}
                  </span>
                </div>
                <p className="mt-2 mb-0" style={{ fontSize: "0.82rem", color: "#888" }}>
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer border-0 pt-0 gap-2">
                <button className="btn btn-secondary btn-sm px-4"
                  onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-sm px-4"
                  style={{ background: BRAND_COLOR, color: "#fff", border: "none" }}
                  onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
