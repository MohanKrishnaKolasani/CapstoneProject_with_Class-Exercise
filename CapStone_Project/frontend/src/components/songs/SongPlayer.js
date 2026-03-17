import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';

function AlbumThumb({ coverImage }) {
  const [err, setErr] = useState(false);
  const url = coverImage ? `http://localhost:5000/${coverImage.replace(/^\//, "")}` : null;

  if (url && !err) {
    return (
      <img
        src={url}
        alt="cover"
        onError={() => setErr(true)}
        style={{ width: 42, height: 42, borderRadius: "8px", objectFit: "cover",
          flexShrink: 0, border: "1px solid rgba(255,255,255,0.15)" }}
      />
    );
  }
  return (
    <div style={{ width: 42, height: 42, borderRadius: "8px",
      background: "rgba(255,255,255,0.1)",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="#c3cfe2" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    </div>
  );
}

function SongPlayer() {
  const { currentSong, playNext, playPrev, stopPlayer } = usePlayer();

  const audioRef                        = useRef(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(1);

  useEffect(() => {
    if (currentSong) setIsPlaying(true);
  }, [currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else           audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  if (!currentSong) return null;

  const audioUrl  = `http://localhost:5000/${currentSong.filePath}`;
  const artists   = currentSong.artistId?.map(a => a.artistName).join(", ") || "";
  const album     = currentSong.albumId?.albumName || "";
  const subtitle  = [artists, album].filter(Boolean).join(" · ");

  const fmt = (t) => {
    if (isNaN(t) || t < 0) return "0:00";
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100,
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      padding: "0 16px",
      height: "72px",
      display: "flex", alignItems: "center", gap: "16px",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.35)",
    }}>
      <audio
        key={audioUrl}
        ref={audioRef}
        src={audioUrl}
        autoPlay
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => { setIsPlaying(false); playNext(); }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: "0 0 220px" }}>
        <AlbumThumb coverImage={currentSong.albumId?.coverImage} />
        <div style={{ minWidth: 0 }}>
          <div style={{ color: "#fff", fontSize: "13px", fontWeight: 500,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {currentSong.songName}
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {subtitle || "—"}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "6px", minWidth: 0 }}>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

          <button onClick={playPrev} title="Previous"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
              color: "rgba(255,255,255,0.7)", display: "flex" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>
            </svg>
          </button>

          <button onClick={() => setIsPlaying(p => !p)} title={isPlaying ? "Pause" : "Play"}
            style={{ width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer",
              background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "transform 0.15s, background 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.background = "#e8e8f0"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#fff"; }}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a2e"
                strokeWidth="2.5" strokeLinecap="round" width="20" height="20">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a2e"
                strokeWidth="2.5" strokeLinecap="round" width="20" height="20"
                style={{ paddingLeft: "2px" }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>

          <button onClick={playNext} title="Next"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
              color: "rgba(255,255,255,0.7)", display: "flex" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", maxWidth: "480px" }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px",
            minWidth: "34px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {fmt(currentTime)}
          </span>
          <div style={{ flex: 1, position: "relative", height: "4px",
            background: "rgba(255,255,255,0.15)", borderRadius: "2px", cursor: "pointer" }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              const newTime = ratio * duration;
              if (audioRef.current) { audioRef.current.currentTime = newTime; setCurrentTime(newTime); }
            }}>
            <div style={{ width: `${pct}%`, height: "100%",
              background: "#c3cfe2", borderRadius: "2px", transition: "width 0.1s linear" }} />
            <div style={{ position: "absolute", top: "50%", left: `${pct}%`,
              transform: "translate(-50%, -50%)", width: "12px", height: "12px",
              borderRadius: "50%", background: "#fff",
              boxShadow: "0 0 4px rgba(0,0,0,0.4)" }} />
          </div>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px",
            minWidth: "34px", fontVariantNumeric: "tabular-nums" }}>
            {fmt(duration)}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px",
        flex: "0 0 160px", justifyContent: "flex-end" }}>

        <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)"
          strokeWidth="2" strokeLinecap="round" width="16" height="16">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
        <input type="range" min="0" max="1" step="0.02" value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          style={{ width: "70px", accentColor: "#c3cfe2", cursor: "pointer" }} />

        <button onClick={stopPlayer} title="Close player"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px",
            color: "rgba(255,255,255,0.4)", display: "flex", borderRadius: "50%" }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SongPlayer;