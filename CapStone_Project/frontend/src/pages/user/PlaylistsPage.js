import React, { useEffect, useState, useCallback } from "react";
import { getPlaylists, createPlaylist, updatePlaylist, deletePlaylist } from "../../services/playlistService";
import { useNavigate } from "react-router-dom";
import { FolderIcon, DiscIcon } from "../../components/common/Icons";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BRAND_COLOR = "#7e0404";

const BTN_STYLE = {
  background: BRAND_COLOR, color: "#fff", border: "none",
  borderRadius: "6px", padding: "8px 20px", fontWeight: "500",
  cursor: "pointer", width: "100%", transition: "opacity 0.2s",
};

function PlaylistsPage() {
  const [playlists, setPlaylists]       = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [confirmId, setConfirmId]       = useState(null);
  const [message, setMessage]           = useState({ text: "", type: "" });
  const [editId, setEditId]             = useState(null);
  const [editName, setEditName]         = useState("");
  const [renameError, setRenameError]   = useState("");

  const pg = usePagination(playlists, 8);

  const navigate = useNavigate();

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const fetchPlaylists = useCallback(() => {
    getPlaylists()
      .then((res) => setPlaylists(res.data))
      .catch(() => showMsg("Failed to load playlists. Please refresh.", "danger"));
  }, []);

  useEffect(() => { fetchPlaylists(); }, [fetchPlaylists]);

  // ── Create ──
  const handleCreate = (e) => {
    e.preventDefault();
    if (!playlistName.trim()) return;
    createPlaylist({ playlistName: playlistName.trim() })
      .then(() => { setPlaylistName(""); fetchPlaylists(); })
      .catch(() => showMsg("Failed to create playlist. Please try again.", "danger"));
  };

  // ── Open rename modal ──
  const openRename = (e, playlist) => {
    e.stopPropagation();
    setEditId(playlist._id);
    setEditName(playlist.playlistName);
    setRenameError("");
  };

  // ── Save rename ──
  const handleRename = (e) => {
    e.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) { setRenameError("Playlist name cannot be empty."); return; }
    if (trimmed.length > 50) { setRenameError("Name must be 50 characters or less."); return; }

    updatePlaylist(editId, { playlistName: trimmed })
      .then(() => {
        setEditId(null);
        setEditName("");
        setRenameError("");
        fetchPlaylists();
        showMsg("Playlist renamed successfully.");
      })
      .catch(() => setRenameError("Failed to rename. Please try again."));
  };

  // ── Delete ──
  const handleDelete = () => {
    if (!confirmId) return;
    deletePlaylist(confirmId)
      .then(() => { setConfirmId(null); fetchPlaylists(); })
      .catch(() => { setConfirmId(null); showMsg("Failed to delete playlist. Please try again.", "danger"); });
  };

  return (
    <div>

      <h2 className="mb-4 d-flex align-items-center gap-2" style={{ color: BRAND_COLOR }}>
        <FolderIcon size={24} color={BRAND_COLOR} /> My Playlists
      </h2>

      {/* ── Alert banner ── */}
      {message.text && (
        <div
          className={`alert alert-${message.type} py-2 px-3 mb-3`}
          style={{ fontSize: "0.875rem" }}
          role="alert"
        >
          {message.text}
        </div>
      )}

      {/* ── Create form ── */}
      <div className="mb-4 p-3 rounded-3 shadow-sm"
        style={{ background: THEME_BG, border: "1px solid rgba(0,0,0,0.07)" }}>
        <form onSubmit={handleCreate} className="row g-2 align-items-center">
          <div className="col-12 col-md-8">
            <input
              className="form-control"
              placeholder="Enter new playlist name..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              maxLength={50}
              required
            />
          </div>
          <div className="col-12 col-md-4">
            <button type="submit" style={BTN_STYLE}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              Create Playlist
            </button>
          </div>
        </form>
      </div>

      {/* ── Playlist cards ── */}
      <div className="row">
        {pg.paged.map((playlist) => (
          <div key={playlist._id} className="col-md-4 col-sm-6 mb-3">
            <div
              className="h-100 text-center py-4 position-relative"
              style={{
                background: THEME_BG, border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "12px", transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* ── Edit (rename) button — top left ── */}
              <button
                onClick={(e) => openRename(e, playlist)}
                title="Rename playlist"
                style={{
                  position: "absolute", top: "10px", left: "10px",
                  background: "rgba(126,4,4,0.08)", border: "none",
                  borderRadius: "50%", width: "30px", height: "30px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: BRAND_COLOR, transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(126,4,4,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(126,4,4,0.08)"}
              >
                {/* Pencil icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              {/* ── Delete button — top right ── */}
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmId(playlist._id); }}
                title="Delete playlist"
                style={{
                  position: "absolute", top: "10px", right: "10px",
                  background: "rgba(126,4,4,0.08)", border: "none",
                  borderRadius: "50%", width: "30px", height: "30px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: BRAND_COLOR, transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(126,4,4,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(126,4,4,0.08)"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>

              {/* ── Card content — clickable to open ── */}
              <div className="card-body" style={{ cursor: "pointer" }}
                onClick={() => navigate(`/playlists/${playlist._id}`)}>
                <span className="d-flex justify-content-center mb-3">
                  <DiscIcon size={48} color={BRAND_COLOR} />
                </span>
                <h4 className="card-title text-truncate fw-bold mb-1" style={{ color: BRAND_COLOR }}>
                  {playlist.playlistName}
                </h4>
                <small style={{ color: "#888" }}>
                  {playlist.songs?.length || 0} song{playlist.songs?.length !== 1 ? "s" : ""}
                </small>
              </div>
            </div>
          </div>
        ))}

        {playlists.length === 0 && (
          <div className="col-12 text-center mt-5" style={{ color: "#888" }}>
            <DiscIcon size={48} color="#ccc" />
            <p className="mt-3">You haven't created any playlists yet.</p>
          </div>
        )}
      </div>
      <Pagination {...pg} />

      {/* ── Rename modal ── */}
      {editId && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: BRAND_COLOR }}>Rename Playlist</h5>
              </div>
              <form onSubmit={handleRename}>
                <div className="modal-body pb-0">
                  <input
                    type="text"
                    className={`form-control ${renameError ? "is-invalid" : ""}`}
                    value={editName}
                    onChange={(e) => { setEditName(e.target.value); setRenameError(""); }}
                    placeholder="Enter new playlist name..."
                    maxLength={50}
                    autoFocus
                  />
                  {renameError && (
                    <div className="invalid-feedback">{renameError}</div>
                  )}
                  <small className="text-muted">{editName.length}/50 characters</small>
                </div>
                <div className="modal-footer border-0 pt-2 gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm px-4"
                    onClick={() => { setEditId(null); setEditName(""); setRenameError(""); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm px-4"
                    style={{ background: BRAND_COLOR, color: "#fff", border: "none" }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {confirmId && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: BRAND_COLOR }}>Delete Playlist</h5>
              </div>
              <div className="modal-body">
                <p className="mb-0">Are you sure you want to delete this playlist? All songs will be removed from it.</p>
              </div>
              <div className="modal-footer border-0 pt-0 gap-2">
                <button className="btn btn-secondary btn-sm px-4"
                  onClick={() => setConfirmId(null)}>Cancel</button>
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

export default PlaylistsPage;