import React, { useEffect, useState } from "react";
import { getAlbums }    from "../../services/albumService";
import { getArtists }   from "../../services/artistService";
import { getDirectors } from "../../services/directorService";
import { searchSongs }  from "../../services/songService";
import { DiscIcon, MicIcon, MusicStaffIcon, MusicNoteIcon } from "../../components/common/Icons";
import { usePlayer } from "../../context/PlayerContext";

const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BRAND_COLOR = "#7e0404";
const TABS = ["Albums", "Artists", "Directors"];

const imgUrl  = (path) => path ? `http://localhost:5000/${path.replace(/^\//, "")}` : null;
const fmtDate = (d)    => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "â€”";


function DetailPanel({ selected, tab, songs, songsLoading, onPlaySong, currentSong }) {
  const isAlbum  = tab === "Albums";
  const isArtist = tab === "Artists";

  if (!selected) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ flex: "0 0 180px", background: THEME_BG, borderRadius: "10px 10px 0 0",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#bbb" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd"
              strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="mb-0 mt-2" style={{ fontSize: "0.85rem" }}>
              Select a{tab === "Albums" ? "n album" : tab === "Artists" ? "n artist" : " director"} to see details
            </p>
          </div>
        </div>
        <div style={{ flex: 1, background: "#fafafa", borderRadius: "0 0 10px 10px",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#ccc", fontSize: "0.8rem", margin: 0 }}>Songs will appear here</p>
        </div>
      </div>
    );
  }

  const name  = isAlbum ? selected.albumName : isArtist ? selected.artistName : selected.directorName;
  const photo = isAlbum ? null : isArtist ? selected.artistPhoto : selected.directorPhoto;
  const icon  = isArtist ? <MicIcon size={36} color="#fff" /> : <MusicStaffIcon size={36} color="#fff" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{
        background: `linear-gradient(135deg, ${BRAND_COLOR} 0%, #5f032c 100%)`,
        borderRadius: "10px 10px 0 0",
        padding: "24px",
        display: "flex", alignItems: "center", gap: "20px",
        flexShrink: 0,
      }}>
        {isAlbum ? (
          <AlbumCoverImg src={selected.coverImage} size={88} radius="12px" />
        ) : (
          <AvatarWhite src={imgUrl(photo)} alt={name} icon={icon} />
        )}

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
            {tab.slice(0, -1)}
          </div>
          <h4 className="fw-bold mb-2 text-truncate" style={{ color: "#fff", fontSize: "1.3rem" }}>
            {name}
          </h4>
          {isAlbum && (
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {selected.directorId?.directorName && (
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" style={{ marginRight: 4 }}>
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                  {selected.directorId.directorName}
                </span>
              )}
              {selected.releaseDate && (
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" style={{ marginRight: 4 }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {fmtDate(selected.releaseDate)}
                </span>
              )}
            </div>
          )}
          {!songsLoading && (
            <div style={{ marginTop: "8px" }}>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff",
                fontSize: "0.72rem", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 }}>
                {songs.length} song{songs.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column",
        background: "#fff", borderRadius: "0 0 10px 10px",
        border: "1px solid rgba(0,0,0,0.08)", borderTop: "none", overflow: "hidden" }}>

        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", gap: "8px", background: "#fafafa" }}>
          <MusicNoteIcon size={15} color={BRAND_COLOR} />
          <span style={{ fontWeight: 600, fontSize: "0.85rem", color: BRAND_COLOR }}>Songs</span>
          {!songsLoading && (
            <span style={{ fontSize: "0.75rem", color: "#aaa" }}>({songs.length})</span>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {songsLoading ? (
            <div className="p-4 text-center" style={{ color: BRAND_COLOR }}>
              <div className="spinner-border spinner-border-sm me-2" role="status" />
              Loading songs...
            </div>
          ) : songs.length === 0 ? (
            <div className="p-4 text-center" style={{ color: "#bbb", fontSize: "0.875rem" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ddd"
                strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 8 }}>
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
              <p className="mb-0">No songs found</p>
            </div>
          ) : (
            songs.map((song, i) => {
              const isPlaying = currentSong?._id === song._id;
              return (
                <div key={song._id}
                  onClick={() => onPlaySong(song, songs)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "10px 16px",
                    background: isPlaying ? BRAND_COLOR : i % 2 === 0 ? "#fff" : "#fafafa",
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!isPlaying) e.currentTarget.style.background = "#f5f0f0"; }}
                  onMouseLeave={e => { if (!isPlaying) e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"; }}
                >
                  <div style={{ width: 24, textAlign: "center", flexShrink: 0 }}>
                    {isPlaying ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    ) : (
                      <span style={{ fontSize: "0.72rem", color: "#bbb" }}>{i + 1}</span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-truncate fw-bold"
                      style={{ fontSize: "0.875rem", color: isPlaying ? "#fff" : "#222" }}>
                      {song.songName}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: isPlaying ? "rgba(255,255,255,0.65)" : "#999" }}>
                      {song.artistId?.length > 0
                        ? song.artistId.map(a => a.artistName).join(", ")
                        : song.albumId?.albumName || "â€”"}
                    </div>
                  </div>

                  {isPlaying ? (
                    <span style={{ fontSize: "11px", color: "#fff",
                      background: "rgba(255,255,255,0.2)", padding: "2px 8px",
                      borderRadius: "20px", flexShrink: 0 }}>
                      Playing
                    </span>
                  ) : song.releaseDate ? (
                    <span style={{ fontSize: "0.7rem", color: "#bbb", flexShrink: 0 }}>
                      {fmtDate(song.releaseDate)}
                    </span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}

function AvatarWhite({ src, alt, icon }) {
  const [err, setErr] = useState(false);
  if (src && !err) {
    return (
      <img src={src} alt={alt} onError={() => setErr(true)}
        style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", flexShrink: 0,
          border: "2px solid rgba(255,255,255,0.4)" }} />
    );
  }
  return (
    <div style={{ width: 88, height: 88, borderRadius: "50%", flexShrink: 0,
      background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </div>
  );
}

function AlbumCoverImg({ src, size, radius, isSelected }) {
  const [err, setErr] = useState(false);
  const url = src ? `http://localhost:5000/${src.replace(/^\//, "")}` : null;

  if (url && !err) {
    return (
      <img src={url} alt="cover" onError={() => setErr(true)}
        style={{ width: size, height: size, borderRadius: radius,
          objectFit: "cover", flexShrink: 0,
          border: isSelected !== undefined
            ? `1.5px solid ${isSelected ? "rgba(255,255,255,0.4)" : BRAND_COLOR}`
            : "2px solid rgba(255,255,255,0.4)" }} />
    );
  }
  if (isSelected !== undefined) {
    return (
      <div style={{ width: size, height: size, borderRadius: radius, flexShrink: 0,
        background: isSelected ? "rgba(255,255,255,0.2)" : "#f0e8e8",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DiscIcon size={size * 0.5} color={isSelected ? "#fff" : BRAND_COLOR} />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <DiscIcon size={size * 0.5} color="#fff" />
    </div>
  );
}

function LibraryPage() {
  const { playSong, currentSong } = usePlayer();
  const [activeTab,    setActiveTab]    = useState("Albums");
  const [albums,       setAlbums]       = useState([]);
  const [artists,      setArtists]      = useState([]);
  const [directors,    setDirectors]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selected,     setSelected]     = useState(null);
  const [songs,        setSongs]        = useState([]);
  const [songsLoading, setSongsLoading] = useState(false);
  const [search,       setSearch]       = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([getAlbums(), getArtists(), getDirectors()])
      .then(([al, ar, d]) => { setAlbums(al.data); setArtists(ar.data); setDirectors(d.data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setSelected(null); setSongs([]); setSearch(""); }, [activeTab]);

  useEffect(() => {
    if (!selected) { setSongs([]); return; }
    setSongsLoading(true);
    let params = {};
    if (activeTab === "Albums")    params = { album:    selected.albumName };
    if (activeTab === "Artists")   params = { artist:   selected.artistName };
    if (activeTab === "Directors") params = { director: selected.directorName };
    searchSongs(params)
      .then(res => setSongs(res.data))
      .catch(err => console.error(err))
      .finally(() => setSongsLoading(false));
  }, [selected, activeTab]);

  const items = activeTab === "Albums" ? albums : activeTab === "Artists" ? artists : directors;

  const filtered = items.filter(item => {
    const name = activeTab === "Albums" ? item.albumName
      : activeTab === "Artists" ? item.artistName : item.directorName;
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  const tabIcon = (tab) => {
    if (tab === "Albums")    return <DiscIcon size={15} color={activeTab === tab ? "#fff" : BRAND_COLOR} />;
    if (tab === "Artists")   return <MicIcon size={15} color={activeTab === tab ? "#fff" : BRAND_COLOR} />;
    if (tab === "Directors") return <MusicStaffIcon size={15} color={activeTab === tab ? "#fff" : BRAND_COLOR} />;
  };

  return (
    <div>
      <h2 className="d-flex align-items-center gap-2 mb-4" style={{ color: BRAND_COLOR }}>
        <DiscIcon size={24} color={BRAND_COLOR} /> Library
      </h2>

      <div className="row g-3" style={{ alignItems: "stretch" }}>
        <div className="col-12 col-lg-5" style={{ display: "flex", flexDirection: "column" }}>
          <div className="rounded-3 shadow-sm overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.08)", background: "#fff",
              display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="d-flex" style={{ background: THEME_BG, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, border: "none", padding: "10px 6px",
                    background: activeTab === tab ? BRAND_COLOR : "transparent",
                    color: activeTab === tab ? "#fff" : BRAND_COLOR,
                    fontWeight: "500", fontSize: "0.82rem", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                    transition: "background 0.2s",
                    borderBottom: activeTab === tab ? `3px solid ${BRAND_COLOR}` : "3px solid transparent",
                  }}>
                  {tabIcon(tab)} {tab}
                </button>
              ))}
            </div>
            <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ position: "relative" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa"
                  strokeWidth="2" strokeLinecap="round"
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input className="form-control form-control-sm"
                  style={{ paddingLeft: "30px" }}
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading ? (
                <div className="p-4 text-center" style={{ color: BRAND_COLOR }}>
                  <div className="spinner-border spinner-border-sm me-2" role="status" /> Loading...
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-4 text-center" style={{ color: "#aaa", fontSize: "0.875rem" }}>
                  No {activeTab.toLowerCase()} found.
                </div>
              ) : (
                filtered.map(item => {
                  const isSelected = selected?._id === item._id;
                  const name  = activeTab === "Albums" ? item.albumName
                    : activeTab === "Artists" ? item.artistName : item.directorName;
                  const photo = activeTab === "Artists" ? item.artistPhoto
                    : activeTab === "Directors" ? item.directorPhoto : null;
                  const icon  = activeTab === "Artists"
                    ? <MicIcon size={20} color={isSelected ? "#fff" : BRAND_COLOR} />
                    : activeTab === "Directors"
                    ? <MusicStaffIcon size={20} color={isSelected ? "#fff" : BRAND_COLOR} />
                    : null;

                  return (
                    <button key={item._id} onClick={() => setSelected(isSelected ? null : item)}
                      style={{
                        width: "100%", border: "none", borderBottom: "1px solid rgba(0,0,0,0.05)",
                        padding: "10px 14px", textAlign: "left", cursor: "pointer",
                        background: isSelected ? BRAND_COLOR : "transparent",
                        color: isSelected ? "#fff" : "#333",
                        display: "flex", alignItems: "center", gap: "12px",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f5f0f0"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                    >
                      {activeTab === "Albums" ? (
                        <AlbumCoverImg src={item.coverImage} size={38} radius="8px" isSelected={isSelected} />
                      ) : (
                        <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden",
                          background: isSelected ? "rgba(255,255,255,0.2)" : "#f0e8e8",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          border: `1.5px solid ${isSelected ? "rgba(255,255,255,0.4)" : BRAND_COLOR}` }}>
                          {photo ? (
                            <img src={imgUrl(photo)} alt={name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={e => { e.target.style.display = "none"; }} />
                          ) : icon}
                        </div>
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="fw-bold text-truncate" style={{ fontSize: "0.875rem" }}>{name}</div>
                        {activeTab === "Albums" && (
                          <div style={{ fontSize: "0.72rem", opacity: isSelected ? 0.8 : 0.6 }}>
                            {item.directorId?.directorName || "No director"} Â· {fmtDate(item.releaseDate)}
                          </div>
                        )}
                      </div>

                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke={isSelected ? "#fff" : "#ccc"} strokeWidth="2" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  );
                })
              )}
            </div>

            {!loading && (
              <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(0,0,0,0.06)",
                background: THEME_BG, fontSize: "0.75rem", color: "#999" }}>
                {filtered.length} {activeTab.toLowerCase()}
                {search && ` matching "${search}"`}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-7" style={{ display: "flex", flexDirection: "column" }}>
          <div className="rounded-3 shadow-sm overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.08)", flex: 1, display: "flex", flexDirection: "column" }}>
            <DetailPanel
              selected={selected}
              tab={activeTab}
              songs={songs}
              songsLoading={songsLoading}
              onPlaySong={playSong}
              currentSong={currentSong}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default LibraryPage;