import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylists, removeSongFromPlaylist } from "../../services/playlistService";
import { usePlayer } from "../../context/PlayerContext";
import { ArrowLeftIcon, DiscIcon, PlayIcon, StopIcon, RepeatIcon, ShuffleIcon, MusicNoteIcon } from "../../components/common/Icons";

const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BRAND_COLOR = "#7e0404";

const btnBase = {
  border: "none",
  borderRadius: "6px",
  padding: "8px 20px",
  fontWeight: "500",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "opacity 0.2s",
};

function PlaylistDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { playSong, stopPlayer, currentSong } = usePlayer();

  const [playlist,    setPlaylist]    = useState(null);
  const [isRepeat,    setIsRepeat]    = useState(false);
  const [isShuffle,   setIsShuffle]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error,       setError]       = useState("");

  const refreshPlaylist = useCallback(() => {
    getPlaylists()
      .then((res) => {
        const found = res.data.find(p => p._id === id);
        setPlaylist(found);
      })
      .catch(() => setError("Failed to load playlist. Please try again."));
  }, [id]);

  useEffect(() => { refreshPlaylist(); }, [refreshPlaylist]);

  const handleRemoveSong = (e, songId, songIndex) => {
    e.stopPropagation();
    removeSongFromPlaylist(id, songId)
      .then(() => {
        if (currentSong?._id === songId) stopPlayer();
        refreshPlaylist();
      })
      .catch(() => {
        setError("Failed to remove song. Please try again.");
        setTimeout(() => setError(""), 3000);
      });
  };

  if (!playlist) return (
    <div className="container mt-4">
      <div className="spinner-border" style={{ color: BRAND_COLOR }} role="status"></div> Loading...
    </div>
  );

  const allSongs = playlist.songs || [];

  const filteredSongs = searchQuery.trim() === ""
    ? allSongs
    : allSongs.filter(song => {
        const q = searchQuery.toLowerCase();
        return (
          song.songName?.toLowerCase().includes(q) ||
          song.albumId?.albumName?.toLowerCase().includes(q) ||
          song.artistId?.some(a => a.artistName?.toLowerCase().includes(q)) ||
          song.directorId?.directorName?.toLowerCase().includes(q)
        );
      });

  const isThisPlaying = currentSong && allSongs.some(s => s._id === currentSong._id);

  const handlePlay    = () => { if (allSongs.length > 0) playSong(allSongs[0], allSongs); };
  const handleStop    = () => stopPlayer();
  const toggleShuffle = () => setIsShuffle(prev => !prev);
  const toggleRepeat  = () => setIsRepeat(prev => !prev);

  const handleSongClick = (song) => playSong(song, allSongs);

  return (
    <div>

      {/* ── Header row ── */}
      <div className="d-flex align-items-center mb-4">
        <button
          className="me-3 d-flex align-items-center gap-2"
          style={{
            ...btnBase,
            background: "transparent",
            border: `2px solid ${BRAND_COLOR}`,
            color: BRAND_COLOR,
            padding: "6px 14px",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = BRAND_COLOR; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BRAND_COLOR; }}
          onClick={() => navigate("/playlists")}
        >
          <ArrowLeftIcon size={16} /> Back
        </button>
        <h2 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ color: BRAND_COLOR }}>
          <DiscIcon size={24} color={BRAND_COLOR} /> {playlist.playlistName}
        </h2>
      </div>

      {/* ── Error alert ── */}
      {error && (
        <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: "0.875rem" }} role="alert">
          {error}
        </div>
      )}

      {/* ── Playback controls ── */}
      <div
        className="mb-4 p-3 rounded-3 shadow-sm"
        style={{ background: THEME_BG, border: "1px solid rgba(0,0,0,0.07)" }}
      >
        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">

          {/* Play */}
          <button
            style={{ ...btnBase, background: BRAND_COLOR, color: "#fff", opacity: allSongs.length === 0 ? 0.5 : 1 }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = allSongs.length === 0 ? "0.5" : "1"}
            onClick={handlePlay}
            disabled={allSongs.length === 0}
          >
            <PlayIcon size={14} color="#fff" /> Play
          </button>

          {/* Stop */}
          <button
            style={{ ...btnBase, background: "#4a5568", color: "#fff", opacity: !isThisPlaying ? 0.5 : 1 }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = !isThisPlaying ? "0.5" : "1"}
            onClick={handleStop}
            disabled={!isThisPlaying}
          >
            <StopIcon size={14} color="#fff" /> Stop
          </button>

          {/* Repeat */}
          <button
            style={{
              ...btnBase,
              background: isRepeat ? BRAND_COLOR : "transparent",
              color: isRepeat ? "#fff" : BRAND_COLOR,
              border: `2px solid ${BRAND_COLOR}`,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            onClick={toggleRepeat}
          >
            <RepeatIcon size={14} color={isRepeat ? "#fff" : BRAND_COLOR} />
            {isRepeat ? "Repeat: ON" : "Repeat: OFF"}
          </button>

          {/* Shuffle */}
          <button
            style={{
              ...btnBase,
              background: isShuffle ? BRAND_COLOR : "transparent",
              color: isShuffle ? "#fff" : BRAND_COLOR,
              border: `2px solid ${BRAND_COLOR}`,
              opacity: allSongs.length === 0 ? 0.5 : 1,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = allSongs.length === 0 ? "0.5" : "1"}
            onClick={toggleShuffle}
            disabled={allSongs.length === 0}
          >
            <ShuffleIcon size={14} color={isShuffle ? "#fff" : BRAND_COLOR} />
            {isShuffle ? "Shuffle: ON" : "Shuffle: OFF"}
          </button>

        </div>
      </div>

      {/* ── Search bar (US6) ── */}
      <div className="mb-3">
        <div style={{ position: "relative" }}>
          {/* Search icon */}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="form-control"
            placeholder="Search songs in this playlist by name, album, artist or director..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "38px", paddingRight: searchQuery ? "38px" : "12px" }}
          />
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", padding: "2px",
                color: "#999", display: "flex", alignItems: "center",
              }}
              title="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Result count when searching */}
        {searchQuery.trim() !== "" && (
          <small style={{ color: "#888", marginTop: "4px", display: "block" }}>
            {filteredSongs.length} result{filteredSongs.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
            {" "}out of {allSongs.length} songs
          </small>
        )}
      </div>

      {/* ── Song list ── */}
      <h4 className="mb-3" style={{ color: "#666" }}>
        Songs ({allSongs.length})
        {searchQuery.trim() !== "" && (
          <span style={{ fontSize: "0.85rem", fontWeight: "400", marginLeft: "8px", color: "#999" }}>
            — showing {filteredSongs.length} match{filteredSongs.length !== 1 ? "es" : ""}
          </span>
        )}
      </h4>

      <div className="mb-5" style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
        {filteredSongs.map((song) => {
          const realIndex = allSongs.findIndex(s => s._id === song._id);
          const isPlaying = currentSong?._id === song._id;

          return (
            <button
              key={song._id}
              onClick={() => handleSongClick(song)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                border: "none",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                background: isPlaying
                  ? BRAND_COLOR
                  : realIndex % 2 === 0 ? "#f5f7fa" : "#eef1f6",
                color: isPlaying ? "#fff" : "#333",
                cursor: "pointer",
                transition: "background 0.15s",
                textAlign: "left",
              }}
              onMouseEnter={e => { if (!isPlaying) e.currentTarget.style.background = "#dce3ed"; }}
              onMouseLeave={e => { if (!isPlaying) e.currentTarget.style.background = realIndex % 2 === 0 ? "#f5f7fa" : "#eef1f6"; }}
            >
              <div className="flex-grow-1">
                <div className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: "0.95rem" }}>
                  <MusicNoteIcon size={14} color={isPlaying ? "#fff" : BRAND_COLOR} />
                  {song.songName}
                </div>
                <small style={{ color: isPlaying ? "rgba(255,255,255,0.7)" : "#888" }}>
                  {song.albumId ? `Album: ${song.albumId.albumName}` : "Unknown Album"}
                  {song.artistId?.length > 0 && (
                    <span> &bull; {song.artistId.map(a => a.artistName).join(", ")}</span>
                  )}
                </small>
              </div>
              <div className="d-flex align-items-center gap-2">
                {isPlaying && (
                  <span
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontSize: "11px",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontWeight: "500",
                    }}
                  >
                    Playing
                  </span>
                )}
                {/* Remove from playlist */}
                <span
                  onClick={(e) => handleRemoveSong(e, song._id, realIndex)}
                  title="Remove from playlist"
                  style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isPlaying ? "rgba(255,255,255,0.2)" : "rgba(126,4,4,0.1)",
                    cursor: "pointer", flexShrink: 0, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = isPlaying ? "rgba(255,255,255,0.35)" : "rgba(126,4,4,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.background = isPlaying ? "rgba(255,255,255,0.2)" : "rgba(126,4,4,0.1)"}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={isPlaying ? "#fff" : BRAND_COLOR}
                    strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </span>
              </div>
            </button>
          );
        })}

        {/* No results from search */}
        {filteredSongs.length === 0 && searchQuery.trim() !== "" && (
          <div className="p-4 text-center" style={{ background: THEME_BG, color: "#888" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "8px" }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="mb-0">No songs found for &quot;{searchQuery}&quot;</p>
            <small>Try a different name, album, or artist.</small>
          </div>
        )}

        {/* Empty playlist */}
        {allSongs.length === 0 && (
          <div className="p-4 text-center" style={{ background: THEME_BG, color: "#888" }}>
            This playlist is empty. Add songs from the library!
          </div>
        )}
      </div>

    </div>
  );
}

export default PlaylistDetails;