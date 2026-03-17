import React, { useState, useRef, useEffect } from "react";
import { usePlaylistSelector } from "../../hooks/usePlaylistSelector";

const ITEM_COLORS = ["#7e0404","#a01010","#5f032c","#3d0218","#b03030","#8b1a1a","#6b2020"];

function PlaylistSelector({ songId }) {
  const { playlists, addSong } = usePlaylistSelector();
  const [open, setOpen]             = useState(false);
  const [toast, setToast]           = useState({ show: false, message: "", type: "" });
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef                = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleAdd = (playlistId) => {
    if (!playlistId) return;
    addSong(playlistId, songId)
      .then(() => { showToast("Song added to playlist!", "success"); setOpen(false); })
      .catch(() => { showToast("Failed to add song.", "danger"); setOpen(false); });
  };

  const handleToggle = () => {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 160);
    }
    setOpen(prev => !prev);
  };

  const dropdownStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1060,
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    overflow: "hidden",
    ...(openUpward
      ? { bottom: "calc(100% + 4px)" }
      : { top: "calc(100% + 4px)" }
    ),
  };

  return (
    <div className="mt-2 position-relative" ref={containerRef}>

      <button
        type="button"
        onClick={handleToggle}
        style={{
          width: "100%",
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: "6px",
          padding: "7px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.9rem",
          color: "#444",
          cursor: "pointer",
        }}
      >
        <span>Add to Playlist</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={dropdownStyle}>
          {playlists.length === 0 ? (
            <div style={{ padding: "10px 14px", fontSize: "0.85rem", color: "#888" }}>
              No playlists yet
            </div>
          ) : (
            playlists.map((playlist, index) => {
              const bg = ITEM_COLORS[index % ITEM_COLORS.length];
              return (
                <button
                  key={playlist._id}
                  type="button"
                  onClick={() => handleAdd(playlist._id)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: bg,
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "opacity 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  {playlist.playlistName}
                </button>
              );
            })
          )}
        </div>
      )}

      {toast.show && (
        <div
          className={`alert alert-${toast.type} py-2 px-3 mt-2 mb-0`}
          style={{ fontSize: "0.8rem" }}
          role="alert"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default PlaylistSelector;