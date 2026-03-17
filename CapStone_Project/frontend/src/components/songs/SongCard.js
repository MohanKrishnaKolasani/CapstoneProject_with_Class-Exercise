import React, { useState } from "react";
import PlaylistSelector from "../playlists/PlaylistSelector";
import { MusicNoteIcon, PlayIcon } from "../common/Icons";

const THEME_BG   = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const PLAY_COLOR = "#7e0404";

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return "N/A";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function SongCard({ song, onPlay }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="h-100"
      style={{
        background: THEME_BG,
        border: `1px solid ${expanded ? PLAY_COLOR : "rgba(0,0,0,0.08)"}`,
        borderRadius: "12px",
        transition: "transform 0.25s, box-shadow 0.25s, border-color 0.2s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1rem" }}>

        <h5
          className="fw-bold text-truncate d-flex align-items-center gap-2 mb-2"
          title={song.songName}
          style={{ color: PLAY_COLOR, fontSize: "1rem", flexShrink: 0 }}
        >
          <MusicNoteIcon size={16} color={PLAY_COLOR} />
          {song.songName}
        </h5>

        {!expanded && (
          <div
            style={{
              fontSize: "0.85rem",
              color: "#444",
              height: "90px",
              overflow: "hidden",
            }}
          >
            <div className="text-truncate">
              <strong>Album:</strong> {song.albumId?.albumName || "N/A"}
            </div>
            <div
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              <strong>Artists:</strong>{" "}
              {song.artistId?.map(a => a.artistName).join(", ") || "N/A"}
            </div>
            <div className="text-truncate">
              <strong>Director:</strong> {song.directorId?.directorName || "N/A"}
            </div>
          </div>
        )}

        {expanded && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              background: "rgba(126,4,4,0.05)",
              border: "1px solid rgba(126,4,4,0.15)",
              fontSize: "0.82rem",
              color: "#333",
            }}
          >
            <p style={{ fontWeight: "500", color: PLAY_COLOR, marginBottom: "6px", fontSize: "0.85rem" }}>
              Song Details
            </p>
            <div className="mb-1">
              <strong>Song:</strong> {song.songName}
            </div>
            <div className="mb-1">
              <strong>Singer(s):</strong>{" "}
              {song.artistId?.length > 0
                ? song.artistId.map(a => a.artistName).join(", ")
                : "N/A"}
            </div>
            <div className="mb-1">
              <strong>Music Director:</strong>{" "}
              {song.directorId?.directorName || "N/A"}
            </div>
            <div className="mb-1">
              <strong>Album:</strong> {song.albumId?.albumName || "N/A"}
            </div>
            <div className="mb-1">
              <strong>Release Date:</strong>{" "}
              {formatDate(song.releaseDate)}
            </div>
            {song.duration && (
              <div className="mb-1">
                <strong>Duration:</strong>{" "}
                {Math.floor(song.duration / 60)}m {song.duration % 60}s
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: "auto", paddingTop: "10px", display: "grid", gap: "8px" }}>

          <button
            style={{
              background: expanded ? "rgba(126,4,4,0.1)" : "transparent",
              color: PLAY_COLOR,
              border: `1px solid ${PLAY_COLOR}`,
              borderRadius: "6px",
              padding: "6px 8px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontSize: "0.85rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(126,4,4,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = expanded ? "rgba(126,4,4,0.1)" : "transparent"}
            onClick={(e) => { e.stopPropagation(); setExpanded(prev => !prev); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={PLAY_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3"/>
              <line x1="12" y1="12" x2="12" y2="16"/>
            </svg>
            {expanded ? "Hide Details" : "View Details"}
          </button>

          <button
            style={{
              background: PLAY_COLOR,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            onClick={(e) => { e.stopPropagation(); onPlay(song); }}
          >
            <PlayIcon size={14} color="#fff" /> Play
          </button>
          <PlaylistSelector songId={song._id} />
        </div>
      </div>
    </div>
  );
}

export default SongCard;