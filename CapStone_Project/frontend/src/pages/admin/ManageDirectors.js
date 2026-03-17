import React, { useEffect, useState } from "react";
import { getDirectors, addDirector, updateDirector, updateDirectorPhoto, deleteDirector } from "../../services/directorService";
import { MusicStaffIcon, PlusIcon } from "../../components/common/Icons";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BRAND_COLOR = "#7e0404";
const SLATE       = "#4a5568";

const btnPrimary   = { background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: "6px", padding: "7px 18px", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s" };
const btnSecondary = { background: SLATE, color: "#fff", border: "none", borderRadius: "6px", padding: "7px 18px", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s" };
const btnSm = (bg) => ({ background: bg, color: "#fff", border: "none", borderRadius: "5px", padding: "4px 12px", fontSize: "0.8rem", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s" });
const hover   = (e) => e.currentTarget.style.opacity = "0.85";
const unhover = (e) => e.currentTarget.style.opacity = "1";

function validateDirector({ directorName, directorPhoto }) {
  const errors = {};
  const name = directorName.trim();
  if (!name)               errors.directorName = "Director name is required.";
  else if (name.length < 2)    errors.directorName = "Name must be at least 2 characters.";
  else if (name.length > 100)  errors.directorName = "Name must be 100 characters or less.";

  if (directorPhoto) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(directorPhoto.type)) errors.directorPhoto = "Only JPG, PNG, WEBP or GIF images are allowed.";
    else if (directorPhoto.size > 2 * 1024 * 1024) errors.directorPhoto = "Image must be under 2 MB.";
  }
  return errors;
}

function ManageDirectors() {
  const [directors, setDirectors]         = useState([]);
  const [directorName, setDirectorName]   = useState("");
  const [directorPhoto, setDirectorPhoto] = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [editDirector, setEditDirector]   = useState(null);
  const [message, setMessage]             = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [errors, setErrors]               = useState({});
  const pg = usePagination(directors, 8);

  const fetchDirectors = async () => {
    try { const res = await getDirectors(); setDirectors(res.data); }
    catch (err) { console.error(err); }
  };
  useEffect(() => { fetchDirectors(); }, []);

  const resetForm = () => { setDirectorName(""); setDirectorPhoto(null); setErrors({}); };
  const openAdd   = () => { setEditDirector(null); resetForm(); setShowForm(true); };
  const openEdit  = (d) => { setEditDirector(d); setDirectorName(d.directorName); setDirectorPhoto(null); setErrors({}); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateDirector({ directorName, directorPhoto });
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    try {
      if (editDirector) {
        await updateDirector(editDirector._id, { directorName: directorName.trim() });
        if (directorPhoto) {
          const fd = new FormData();
          fd.append("directorPhoto", directorPhoto);
          await updateDirectorPhoto(editDirector._id, fd);
        }
        setMessage("Director updated successfully");
      } else {
        const fd = new FormData();
        fd.append("directorName", directorName.trim());
        if (directorPhoto) fd.append("directorPhoto", directorPhoto);
        await addDirector(fd);
        setMessage("Director added successfully");
      }
      setShowForm(false); resetForm(); fetchDirectors();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { console.error(err); setMessage("Error saving director"); }
  };

  const handleDelete = (id) => setConfirmDelete(id);
  const confirmDeleteAction = async () => {
    try { await deleteDirector(confirmDelete); fetchDirectors(); }
    catch (err) { console.error(err); }
    finally { setConfirmDelete(null); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="d-flex align-items-center gap-2 mb-0" style={{ color: BRAND_COLOR }}>
          <MusicStaffIcon size={26} color={BRAND_COLOR} /> Manage Directors
        </h2>
        <button style={btnPrimary} onMouseEnter={hover} onMouseLeave={unhover}
          onClick={openAdd} className="d-flex align-items-center gap-2">
          <PlusIcon size={14} color="#fff" /> Add Director
        </button>
      </div>
      {message && (
        <div className={`alert ${message.toLowerCase().includes("error") ? "alert-danger" : "alert-success"} py-2 px-3`}
          style={{ fontSize: "0.875rem" }} role="alert">
          {message}
        </div>
      )}
      {showForm && (
        <div className="mb-4 p-3 rounded-3 shadow-sm" style={{ background: THEME_BG, border: "1px solid rgba(0,0,0,0.07)" }}>
          <form onSubmit={handleSubmit} noValidate>

            <div className="mb-3">
              <label style={{ fontSize: "0.875rem", color: "#555" }}>
                Director Name <span style={{ color: BRAND_COLOR }}>*</span>
              </label>
              <input
                className={`form-control ${errors.directorName ? "is-invalid" : ""}`}
                value={directorName}
                maxLength={100}
                onChange={(e) => { setDirectorName(e.target.value); setErrors(prev => ({ ...prev, directorName: "" })); }}
                placeholder="Enter director name"
              />
              {errors.directorName
                ? <div className="invalid-feedback">{errors.directorName}</div>
                : <small className="text-muted">{directorName.length}/100 characters</small>}
            </div>

            <div className="mb-3">
              <label style={{ fontSize: "0.875rem", color: "#555" }}>
                Director Photo <small style={{ color: "#999" }}>(JPG/PNG/WEBP, max 2 MB)</small>
              </label>
              <input
                type="file"
                className={`form-control ${errors.directorPhoto ? "is-invalid" : ""}`}
                accept="image/*"
                onChange={(e) => { setDirectorPhoto(e.target.files[0]); setErrors(prev => ({ ...prev, directorPhoto: "" })); }}
              />
              {errors.directorPhoto && <div className="invalid-feedback">{errors.directorPhoto}</div>}
              {directorPhoto && (
                <img src={URL.createObjectURL(directorPhoto)} alt="preview"
                  style={{ width: "70px", height: "70px", marginTop: "10px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${BRAND_COLOR}` }} />
              )}
            </div>
            <div className="d-flex gap-2">
              <button type="submit" style={btnPrimary} onMouseEnter={hover} onMouseLeave={unhover}>
                {editDirector ? "Update Director" : "Add Director"}
              </button>
              <button type="button" style={btnSecondary} onMouseEnter={hover} onMouseLeave={unhover}
                onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="row">
        {pg.paged.map((director) => (
          <div key={director._id} className="col-md-3 col-sm-6 mb-3">
            <div className="text-center p-3 rounded-3 shadow-sm"
              style={{ background: THEME_BG, border: "1px solid rgba(0,0,0,0.07)" }}>
              {director.directorPhoto ? (
                <img src={`http://localhost:5000/${director.directorPhoto}`} alt={director.directorName}
                  style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%", margin: "auto", border: `2px solid ${BRAND_COLOR}` }} />
              ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                  <MusicStaffIcon size={40} color={BRAND_COLOR} />
                </div>
              )}
              <h6 className="mt-2 fw-bold" style={{ color: BRAND_COLOR }}>{director.directorName}</h6>
              <div className="d-flex justify-content-center gap-2 mt-2">
                <button style={btnSm(BRAND_COLOR)} onMouseEnter={hover} onMouseLeave={unhover} onClick={() => openEdit(director)}>Edit</button>
                <button style={btnSm(SLATE)} onMouseEnter={hover} onMouseLeave={unhover} onClick={() => handleDelete(director._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {directors.length === 0 && <p style={{ color: "#888" }}>No directors added yet.</p>}
      </div>
      <Pagination {...pg} />
      {confirmDelete && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: BRAND_COLOR }}>Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p className="mb-0">Are you sure you want to delete this director? This cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 pt-0 gap-2">
                <button className="btn btn-secondary btn-sm px-4" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-sm px-4" style={{ background: BRAND_COLOR, color: "#fff", border: "none" }} onClick={confirmDeleteAction}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDirectors;