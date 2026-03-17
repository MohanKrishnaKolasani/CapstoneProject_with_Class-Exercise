import React, { useEffect, useState } from "react";
import {
  getAllSongsAdmin, addSong, deleteSong, toggleVisibility, updateSong,
} from "../../services/songService";
import { getAlbums } from "../../services/albumService";
import { getArtists } from "../../services/artistService";
import { getDirectors } from "../../services/directorService";
import API from "../../api/axiosConfig";
import { MusicNoteIcon, BellIcon, PlusIcon } from "../../components/common/Icons";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BRAND_COLOR = "#7e0404";
const SLATE       = "#4a5568";

const btnPrimary   = { background: BRAND_COLOR, color: "#fff", border: "none", borderRadius: "6px", padding: "7px 16px", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s", display: "flex", alignItems: "center", gap: "6px" };
const btnSecondary = { background: SLATE, color: "#fff", border: "none", borderRadius: "6px", padding: "7px 16px", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s" };
const btnSm = (bg) => ({ background: bg, color: "#fff", border: "none", borderRadius: "5px", padding: "3px 10px", fontSize: "0.78rem", fontWeight: "500", cursor: "pointer", transition: "opacity 0.2s" });
const hover   = (e) => e.currentTarget.style.opacity = "0.85";
const unhover = (e) => e.currentTarget.style.opacity = "1";

const EMPTY_FORM = { songName: "", albumId: "", artistId: [], directorId: "", duration: "", releaseDate: "" };

function ManageSongs() {
  const [songs, setSongs]         = useState([]);
  const [albums, setAlbums]       = useState([]);
  const [artists, setArtists]     = useState([]);
  const [directors, setDirectors] = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [songFile, setSongFile]   = useState(null);
  const [editSong, setEditSong]   = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [message, setMessage]     = useState("");
  const [search, setSearch]       = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const filteredSongs = songs.filter(s => s.songName.toLowerCase().includes(search.toLowerCase()));
  const pg = usePagination(filteredSongs, 10);

  const [showNotifModal, setShowNotifModal]   = useState(false);
  const [notifMessage, setNotifMessage]       = useState("");
  const [notifError, setNotifError]           = useState("");
  const [notifLoading, setNotifLoading]       = useState(false);

  const loadData = async () => {
    try {
      const [s, al, ar, d] = await Promise.all([getAllSongsAdmin(), getAlbums(), getArtists(), getDirectors()]);
      setSongs(s.data); setAlbums(al.data); setArtists(ar.data); setDirectors(d.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { loadData(); }, []);

  const openAdd = () => { setEditSong(null); setForm(EMPTY_FORM); setSongFile(null); setShowForm(true); };
  const openEdit = (song) => {
    setEditSong(song);
    setForm({ songName: song.songName, albumId: song.albumId?._id || "", artistId: song.artistId?.map(a => a._id) || [], directorId: song.directorId?._id || "", duration: song.duration || "", releaseDate: song.releaseDate ? song.releaseDate.slice(0, 10) : "" });
    setShowForm(true);
  };

  const handleArtistChange = (e) => setForm({ ...form, artistId: Array.from(e.target.selectedOptions).map(o => o.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSong) {
        await updateSong(editSong._id, form); setMessage("Song updated successfully");
      } else {
        const fd = new FormData();
        fd.append("songName", form.songName); fd.append("albumId", form.albumId);
        fd.append("artistId", JSON.stringify(form.artistId)); fd.append("directorId", form.directorId);
        fd.append("duration", form.duration);
        if (form.releaseDate) fd.append("releaseDate", form.releaseDate);
        if (songFile) fd.append("songFile", songFile);
        await addSong(fd); setMessage("Song added successfully");
      }
      setShowForm(false); loadData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { console.error(err); setMessage("Error saving song"); }
  };

  const handleDelete = (id) => setConfirmDelete(id);
  const confirmDeleteAction = async () => {
    try { await deleteSong(confirmDelete); loadData(); }
    catch (err) { console.error(err); }
    finally { setConfirmDelete(null); }
  };

  const handleToggleVisibility = async (id) => { await toggleVisibility(id); loadData(); };

  const openNotifModal = () => {
    setNotifMessage("");
    setNotifError("");
    setShowNotifModal(true);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    const trimmed = notifMessage.trim();
    if (!trimmed) { setNotifError("Please enter a message."); return; }
    if (trimmed.length > 200) { setNotifError("Message must be 200 characters or less."); return; }

    setNotifLoading(true);
    setNotifError("");
    try {
      const res = await API.post("/notifications/broadcast", { message: trimmed });
      setShowNotifModal(false);
      setNotifMessage("");
      setMessage(res.data.message || "Notification sent to all users!");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setNotifError(err.response?.data?.message || "Failed to send notification. Try again.");
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold d-flex align-items-center gap-2 mb-0" style={{ color: BRAND_COLOR }}>
          <MusicNoteIcon size={22} color={BRAND_COLOR} /> Manage Songs
        </h2>
        <div className="d-flex gap-2">
          <button style={{ ...btnSecondary, display: "flex", alignItems: "center", gap: "6px" }}
            onMouseEnter={hover} onMouseLeave={unhover} onClick={openNotifModal}>
            <BellIcon size={15} color="#fff" /> Send Notification
          </button>
          <button style={btnPrimary} onMouseEnter={hover} onMouseLeave={unhover} onClick={openAdd}>
            <PlusIcon size={15} color="#fff" /> Add Song
          </button>
        </div>
      </div>
      {message && (
        <div
          className={`alert ${message.toLowerCase().includes("error") ? "alert-danger" : message.toLowerCase().includes("notification") ? "alert-info" : "alert-success"} py-2 px-3`}
          style={{ fontSize: "0.875rem" }}
          role="alert"
        >
          {message}
        </div>
      )}

      <div className="mb-3">
        <input className="form-control" placeholder="Search songs..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {showForm && (
        <div className="mb-4 p-3 rounded-3 shadow-sm" style={{ background: THEME_BG, border: "1px solid rgba(0,0,0,0.07)" }}>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>Song Name</label>
                <input className="form-control" value={form.songName} required onChange={(e) => setForm({ ...form, songName: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>Album</label>
                <select className="form-select" value={form.albumId} onChange={(e) => setForm({ ...form, albumId: e.target.value })}>
                  <option value="">Select Album</option>
                  {albums.map(a => <option key={a._id} value={a._id}>{a.albumName}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>Director</label>
                <select className="form-select" value={form.directorId} onChange={(e) => setForm({ ...form, directorId: e.target.value })}>
                  <option value="">Select Director</option>
                  {directors.map(d => <option key={d._id} value={d._id}>{d.directorName}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>Duration (seconds)</label>
                <input type="number" className="form-control" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>Release Date</label>
                <input type="date" className="form-control" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} />
              </div>
              <div className="col-12">
                <label style={{ fontSize: "0.875rem", color: "#555" }}>Artists <small style={{ color: "#999" }}>(hold Ctrl to select multiple)</small></label>
                <select multiple className="form-select" value={form.artistId} onChange={handleArtistChange}>
                  {artists.map(a => <option key={a._id} value={a._id}>{a.artistName}</option>)}
                </select>
              </div>
              {!editSong && (
                <div className="col-12">
                  <label style={{ fontSize: "0.875rem", color: "#555" }}>Song File</label>
                  <input type="file" className="form-control" onChange={(e) => setSongFile(e.target.files[0])} required />
                </div>
              )}
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" style={btnPrimary} onMouseEnter={hover} onMouseLeave={unhover}>
                {editSong ? "Update Song" : "Add Song"}
              </button>
              <button type="button" style={btnSecondary} onMouseEnter={hover} onMouseLeave={unhover} onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-3 overflow-hidden shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ background: BRAND_COLOR, color: "#fff" }}>
              <tr>
                <th className="px-3">#</th>
                <th>Song</th>
                <th>Album</th>
                <th>Director</th>
                <th>Release Date</th>
                <th>Visible</th>
                <th className="text-end px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pg.paged.map((song, index) => (
                  <tr key={song._id} style={{ background: index % 2 === 0 ? "#f5f7fa" : "#eef1f6" }}>
                    <td className="px-3 align-middle">{index + 1}</td>
                    <td className="align-middle fw-bold" style={{ color: BRAND_COLOR }}>{song.songName}</td>
                    <td className="align-middle">{song.albumId?.albumName || "N/A"}</td>
                    <td className="align-middle">{song.directorId?.directorName || "N/A"}</td>
                    <td className="align-middle">{song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : "N/A"}</td>
                    <td className="align-middle">
                      <span style={{
                        background: song.isVisible ? "#d4edda" : "#e2e8f0",
                        color: song.isVisible ? "#155724" : "#4a5568",
                        fontSize: "0.75rem", padding: "3px 10px", borderRadius: "20px", fontWeight: "500"
                      }}>
                        {song.isVisible ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="text-end px-3 align-middle">
                      <div className="d-flex justify-content-end gap-1">
                        <button style={btnSm(BRAND_COLOR)} onMouseEnter={hover} onMouseLeave={unhover} onClick={() => openEdit(song)}>Edit</button>
                        <button style={btnSm(song.isVisible ? "#b45309" : "#2d6a4f")} onMouseEnter={hover} onMouseLeave={unhover} onClick={() => handleToggleVisibility(song._id)}>
                          {song.isVisible ? "Hide" : "Show"}
                        </button>
                        <button style={btnSm(SLATE)} onMouseEnter={hover} onMouseLeave={unhover} onClick={() => handleDelete(song._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              {songs.length === 0 && (
                <tr><td colSpan="7" className="text-center p-4" style={{ color: "#888" }}>No songs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination {...pg} />
      </div>

      {showNotifModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2" style={{ color: BRAND_COLOR }}>
                  <BellIcon size={18} color={BRAND_COLOR} /> Send Notification
                </h5>
              </div>
              <form onSubmit={handleSendNotification}>
                <div className="modal-body pb-1">
                  <p className="text-muted mb-2" style={{ fontSize: "0.875rem" }}>
                    This message will be sent as a notification to <strong>all registered users</strong>.
                  </p>
                  <textarea
                    className={`form-control ${notifError ? "is-invalid" : ""}`}
                    rows={3}
                    placeholder="e.g. New songs have been added to the library! Check them out."
                    value={notifMessage}
                    onChange={(e) => { setNotifMessage(e.target.value); setNotifError(""); }}
                    maxLength={200}
                    autoFocus
                  />
                  {notifError && <div className="invalid-feedback">{notifError}</div>}
                  <small className="text-muted">{notifMessage.length}/200 characters</small>
                </div>
                <div className="modal-footer border-0 pt-1 gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm px-4"
                    onClick={() => setShowNotifModal(false)}
                    disabled={notifLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm px-4"
                    style={{ background: BRAND_COLOR, color: "#fff", border: "none" }}
                    disabled={notifLoading}
                  >
                    {notifLoading ? "Sending..." : "Send"}
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
                <h5 className="modal-title fw-bold" style={{ color: "#7e0404" }}>Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p className="mb-0">Are you sure you want to delete this song? This cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 pt-0 gap-2">
                <button
                  className="btn btn-secondary btn-sm px-4"
                  onClick={() => setConfirmDelete(null)}
                >Cancel</button>
                <button
                  className="btn btn-sm px-4"
                  style={{ background: "#7e0404", color: "#fff", border: "none" }}
                  onClick={confirmDeleteAction}
                >Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSongs;