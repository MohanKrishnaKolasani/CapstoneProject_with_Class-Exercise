import React, { useEffect, useState } from "react";
import { getAlbums, addAlbum, updateAlbum, deleteAlbum, getDirectors } from "../../services/albumService";
import { DiscIcon, PlusIcon } from "../../components/common/Icons";
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

const EMPTY = { albumName: "", releaseDate: "", directorId: "" };

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE      = 2 * 1024 * 1024;

function validateAlbum({ albumName, releaseDate, coverImage, isEdit }) {
  const errors = {};
  const name = albumName.trim();
  if (!name)              errors.albumName = "Album name is required.";
  else if (name.length > 150) errors.albumName = "Album name must be 150 characters or less.";

  if (releaseDate) {
    const d = new Date(releaseDate);
    if (isNaN(d.getTime()))        errors.releaseDate = "Please enter a valid date.";
    else if (d.getFullYear() < 1900) errors.releaseDate = "Release year must be 1900 or later.";
    else if (d > new Date())       errors.releaseDate = "Release date cannot be in the future.";
  }

  if (coverImage) {
    if (!ALLOWED_TYPES.includes(coverImage.type))
      errors.coverImage = "Only JPG, PNG, WEBP or GIF images are allowed.";
    else if (coverImage.size > MAX_SIZE)
      errors.coverImage = "Image must be under 2 MB.";
  }

  return errors;
}

function AlbumCover({ src, size = 44, radius = "8px" }) {
  const [err, setErr] = useState(false);
  if (src && !err) {
    return (
      <img
        src={`http://localhost:5000/${src.replace(/^\//, "")}`}
        alt="cover"
        onError={() => setErr(true)}
        style={{ width: size, height: size, objectFit: "cover",
          borderRadius: radius, border: `1.5px solid ${BRAND_COLOR}`, flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: radius,
      background: "#f0e8e8", display: "flex", alignItems: "center",
      justifyContent: "center", border: `1.5px solid ${BRAND_COLOR}`, flexShrink: 0 }}>
      <DiscIcon size={size * 0.5} color={BRAND_COLOR} />
    </div>
  );
}

function ManageAlbums() {
  const [albums,    setAlbums]    = useState([]);
  const [directors, setDirectors] = useState([]);
  const [form,      setForm]      = useState(EMPTY);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const [editAlbum, setEditAlbum] = useState(null);
  const [message,   setMessage]   = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [errors,    setErrors]    = useState({});
  const pg = usePagination(albums, 8);

  const fetchData = async () => {
    try {
      const [a, d] = await Promise.all([getAlbums(), getDirectors()]);
      setAlbums(a.data); setDirectors(d.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm(EMPTY);
    setCoverFile(null);
    setCoverPreview(null);
    setErrors({});
  };

  const openAdd = () => { setEditAlbum(null); resetForm(); setShowForm(true); };
  const openEdit = (album) => {
    setEditAlbum(album);
    setForm({
      albumName:   album.albumName,
      releaseDate: album.releaseDate ? album.releaseDate.slice(0, 10) : "",
      directorId:  album.directorId?._id || "",
    });
    setCoverFile(null);
    setCoverPreview(null);
    setErrors({});
    setShowForm(true);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, coverImage: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateAlbum({ ...form, coverImage: coverFile, isEdit: !!editAlbum });
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const fd = new FormData();
    fd.append("albumName",   form.albumName.trim());
    fd.append("releaseDate", form.releaseDate);
    fd.append("directorId",  form.directorId);
    if (coverFile) fd.append("coverImage", coverFile);

    try {
      if (editAlbum) {
        await updateAlbum(editAlbum._id, fd);
        setMessage("Album updated successfully");
      } else {
        await addAlbum(fd);
        setMessage("Album added successfully");
      }
      setShowForm(false); resetForm(); fetchData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { console.error(err); setMessage("Error saving album"); }
  };

  const confirmDeleteAction = async () => {
    try { await deleteAlbum(confirmDelete); fetchData(); }
    catch (err) { console.error(err); }
    finally { setConfirmDelete(null); }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="d-flex align-items-center gap-2 mb-0" style={{ color: BRAND_COLOR }}>
          <DiscIcon size={26} color={BRAND_COLOR} /> Manage Albums
        </h2>
        <button style={btnPrimary} onMouseEnter={hover} onMouseLeave={unhover}
          onClick={openAdd} className="d-flex align-items-center gap-2">
          <PlusIcon size={14} color="#fff" /> Add Album
        </button>
      </div>
      {message && (
        <div className={`alert ${message.toLowerCase().includes("error") ? "alert-danger" : "alert-success"} py-2 px-3`}
          style={{ fontSize: "0.875rem" }} role="alert">
          {message}
        </div>
      )}

      {showForm && (
        <div className="mb-4 p-3 rounded-3 shadow-sm"
          style={{ background: THEME_BG, border: "1px solid rgba(0,0,0,0.07)" }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3 mb-3">

              <div className="col-md-6">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>
                  Album Name <span style={{ color: BRAND_COLOR }}>*</span>
                </label>
                <input
                  className={`form-control ${errors.albumName ? "is-invalid" : ""}`}
                  value={form.albumName} maxLength={150}
                  onChange={(e) => handleChange("albumName", e.target.value)}
                  placeholder="Enter album name"
                />
                {errors.albumName
                  ? <div className="invalid-feedback">{errors.albumName}</div>
                  : <small className="text-muted">{form.albumName.length}/150 characters</small>}
              </div>

              <div className="col-md-6">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>
                  Release Date <small style={{ color: "#999" }}>(cannot be future)</small>
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.releaseDate ? "is-invalid" : ""}`}
                  value={form.releaseDate} max={todayStr} min="1900-01-01"
                  onChange={(e) => handleChange("releaseDate", e.target.value)}
                />
                {errors.releaseDate && <div className="invalid-feedback">{errors.releaseDate}</div>}
              </div>

              <div className="col-md-6">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>Music Director</label>
                <select className="form-select" value={form.directorId}
                  onChange={(e) => handleChange("directorId", e.target.value)}>
                  <option value="">Select Director (optional)</option>
                  {directors.map((d) => (
                    <option key={d._id} value={d._id}>{d.directorName}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>
                  Cover Image{" "}
                  <small style={{ color: "#999" }}>(JPG/PNG/WEBP, max 2 MB)</small>
                  {editAlbum?.coverImage && !coverFile && (
                    <small style={{ color: BRAND_COLOR, marginLeft: 8 }}>
                      — current cover kept if no new file chosen
                    </small>
                  )}
                </label>
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    className={`form-control ${errors.coverImage ? "is-invalid" : ""}`}
                    onChange={handleCoverChange}
                  />

                  {coverPreview && (
                    <img src={coverPreview} alt="preview"
                      style={{ width: 52, height: 52, objectFit: "cover",
                        borderRadius: "8px", border: `2px solid ${BRAND_COLOR}`, flexShrink: 0 }} />
                  )}

                  {!coverPreview && editAlbum?.coverImage && (
                    <AlbumCover src={editAlbum.coverImage} size={52} radius="8px" />
                  )}
                </div>
                {errors.coverImage && (
                  <div style={{ color: BRAND_COLOR, fontSize: "0.78rem", marginTop: 3 }}>
                    {errors.coverImage}
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" style={btnPrimary} onMouseEnter={hover} onMouseLeave={unhover}>
                {editAlbum ? "Update Album" : "Add Album"}
              </button>
              <button type="button" style={btnSecondary} onMouseEnter={hover} onMouseLeave={unhover}
                onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-3 overflow-hidden shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
        <table className="table table-hover mb-0">
          <thead style={{ background: BRAND_COLOR, color: "#fff" }}>
            <tr>
              <th className="px-3">#</th>
              <th>Cover</th>
              <th>Album Name</th>
              <th>Director</th>
              <th>Release Date</th>
              <th className="text-end px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pg.paged.map((album, index) => (
              <tr key={album._id} style={{ background: index % 2 === 0 ? "#f5f7fa" : "#eef1f6", verticalAlign: "middle" }}>
                <td className="px-3">{index + 1}</td>
                <td>
                  <AlbumCover src={album.coverImage} size={44} radius="8px" />
                </td>
                <td className="fw-bold" style={{ color: BRAND_COLOR }}>{album.albumName}</td>
                <td>{album.directorId?.directorName || "N/A"}</td>
                <td>
                  {album.releaseDate
                    ? new Date(album.releaseDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="text-end px-3">
                  <div className="d-flex justify-content-end gap-2">
                    <button style={btnSm(BRAND_COLOR)} onMouseEnter={hover} onMouseLeave={unhover}
                      onClick={() => openEdit(album)}>Edit</button>
                    <button style={btnSm(SLATE)} onMouseEnter={hover} onMouseLeave={unhover}
                      onClick={() => setConfirmDelete(album._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {albums.length === 0 && (
              <tr><td colSpan="6" className="text-center p-4" style={{ color: "#888" }}>No albums found.</td></tr>
            )}
          </tbody>
        </table>
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
                <p className="mb-0">Are you sure you want to delete this album? This cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 pt-0 gap-2">
                <button className="btn btn-secondary btn-sm px-4"
                  onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-sm px-4"
                  style={{ background: BRAND_COLOR, color: "#fff", border: "none" }}
                  onClick={confirmDeleteAction}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAlbums;
