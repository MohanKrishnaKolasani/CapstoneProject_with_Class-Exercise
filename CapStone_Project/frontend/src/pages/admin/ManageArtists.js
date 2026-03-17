import React, { useEffect, useState } from "react";
import { getArtists, addArtist, updateArtist, updateArtistPhoto, deleteArtist } from "../../services/artistService";
import { MicIcon, PlusIcon } from "../../components/common/Icons";
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

function validateArtist({ artistName, artistPhoto, isEdit }) {
  const errors = {};
  const name = artistName.trim();
  if (!name)              errors.artistName = "Artist name is required.";
  else if (name.length < 2)  errors.artistName = "Name must be at least 2 characters.";
  else if (name.length > 100) errors.artistName = "Name must be 100 characters or less.";

  if (artistPhoto) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(artistPhoto.type)) errors.artistPhoto = "Only JPG, PNG, WEBP or GIF images are allowed.";
    else if (artistPhoto.size > 2 * 1024 * 1024) errors.artistPhoto = "Image must be under 2 MB.";
  }
  return errors;
}

function ManageArtists() {
  const [artists, setArtists]           = useState([]);
  const [artistName, setArtistName]     = useState("");
  const [artistPhoto, setArtistPhoto]   = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [editArtist, setEditArtist]     = useState(null);
  const [message, setMessage]           = useState("");
  const [loading, setLoading]           = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [errors, setErrors]             = useState({});
  const pg = usePagination(artists, 8);

  const fetchArtists = async () => {
    try { setLoading(true); const res = await getArtists(); setArtists(res.data); }
    catch (err) { console.error(err); setMessage("Error loading artists"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchArtists(); }, []);

  const resetForm = () => { setArtistName(""); setArtistPhoto(null); setEditArtist(null); setErrors({}); };
  const openAdd   = () => { resetForm(); setShowForm(true); };
  const openEdit  = (a) => { setEditArtist(a); setArtistName(a.artistName); setArtistPhoto(null); setErrors({}); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateArtist({ artistName, artistPhoto, isEdit: !!editArtist });
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    try {
      if (editArtist) {
        await updateArtist(editArtist._id, { artistName: artistName.trim() });
        if (artistPhoto) {
          const fd = new FormData();
          fd.append("artistPhoto", artistPhoto);
          await updateArtistPhoto(editArtist._id, fd);
        }
        setMessage("Artist updated successfully");
      } else {
        const fd = new FormData();
        fd.append("artistName", artistName.trim());
        if (artistPhoto) fd.append("artistPhoto", artistPhoto);
        await addArtist(fd);
        setMessage("Artist added successfully");
      }
      setShowForm(false); resetForm(); fetchArtists();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { console.error(err); setMessage("Error saving artist"); }
  };

  const handleDelete = (id) => setConfirmDelete(id);
  const confirmDeleteAction = async () => {
    try { await deleteArtist(confirmDelete); fetchArtists(); }
    catch (err) { console.error(err); setMessage("Error deleting artist"); }
    finally { setConfirmDelete(null); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="d-flex align-items-center gap-2 mb-0" style={{ color: BRAND_COLOR }}>
          <MicIcon size={26} color={BRAND_COLOR} /> Manage Artists
        </h2>
        <button style={btnPrimary} onMouseEnter={hover} onMouseLeave={unhover}
          onClick={openAdd} className="d-flex align-items-center gap-2">
          <PlusIcon size={14} color="#fff" /> Add Artist
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
                Artist Name <span style={{ color: BRAND_COLOR }}>*</span>
              </label>
              <input
                className={`form-control ${errors.artistName ? "is-invalid" : ""}`}
                value={artistName}
                maxLength={100}
                onChange={(e) => { setArtistName(e.target.value); setErrors(prev => ({ ...prev, artistName: "" })); }}
                placeholder="Enter artist name"
              />
              {errors.artistName
                ? <div className="invalid-feedback">{errors.artistName}</div>
                : <small className="text-muted">{artistName.length}/100 characters</small>}
            </div>

            <div className="mb-3">
              <label style={{ fontSize: "0.875rem", color: "#555" }}>
                Artist Photo <small style={{ color: "#999" }}>(JPG/PNG/WEBP, max 2 MB)</small>
              </label>
              <input
                type="file"
                className={`form-control ${errors.artistPhoto ? "is-invalid" : ""}`}
                accept="image/*"
                onChange={(e) => { setArtistPhoto(e.target.files[0]); setErrors(prev => ({ ...prev, artistPhoto: "" })); }}
              />
              {errors.artistPhoto && <div className="invalid-feedback">{errors.artistPhoto}</div>}
              {artistPhoto && (
                <img src={URL.createObjectURL(artistPhoto)} alt="preview"
                  style={{ width: "70px", height: "70px", marginTop: "10px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${BRAND_COLOR}` }} />
              )}
            </div>
            <div className="d-flex gap-2">
              <button type="submit" style={btnPrimary} onMouseEnter={hover} onMouseLeave={unhover}>
                {editArtist ? "Update Artist" : "Add Artist"}
              </button>
              <button type="button" style={btnSecondary} onMouseEnter={hover} onMouseLeave={unhover}
                onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <div className="text-center mt-4" style={{ color: BRAND_COLOR }}>Loading artists...</div>
      ) : artists.length === 0 ? (
        <p style={{ color: "#888" }}>No artists added yet.</p>
      ) : (
        <div className="row">
          {pg.paged.map((artist) => (
            <div key={artist._id} className="col-md-3 col-sm-6 mb-3">
              <div className="text-center p-3 rounded-3 shadow-sm"
                style={{ background: THEME_BG, border: "1px solid rgba(0,0,0,0.07)" }}>
                {artist.artistPhoto ? (
                  <img src={`http://localhost:5000/${artist.artistPhoto}`} alt={artist.artistName}
                    style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%", margin: "auto", border: `2px solid ${BRAND_COLOR}` }} />
                ) : (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                    <MicIcon size={40} color={BRAND_COLOR} />
                  </div>
                )}
                <h6 className="mt-2 fw-bold" style={{ color: BRAND_COLOR }}>{artist.artistName}</h6>
                <div className="d-flex justify-content-center gap-2 mt-2">
                  <button style={btnSm(BRAND_COLOR)} onMouseEnter={hover} onMouseLeave={unhover} onClick={() => openEdit(artist)}>Edit</button>
                  <button style={btnSm(SLATE)} onMouseEnter={hover} onMouseLeave={unhover} onClick={() => handleDelete(artist._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination {...pg} />
      {confirmDelete && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: BRAND_COLOR }}>Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p className="mb-0">Are you sure you want to delete this artist? This cannot be undone.</p>
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

export default ManageArtists;