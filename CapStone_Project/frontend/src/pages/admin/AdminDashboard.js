import { useNavigate } from "react-router-dom";
import { getSongs }     from "../../services/songService";
import { getArtists }   from "../../services/artistService";
import { getDirectors } from "../../services/directorService";
import { getAlbums }    from "../../services/albumService";
import { getUsers }     from "../../services/userService";
import { useEffect, useState } from "react";
import { MusicNoteIcon, MicIcon, MusicStaffIcon, DiscIcon, SettingsIcon, UserIcon } from "../../components/common/Icons";

const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BRAND_COLOR = "#7e0404";

const STAT_CARDS = [
  { key: "songs",     label: "Total Songs",     bg: "#7e0404", icon: <MusicNoteIcon size={28} color="#fff" /> },
  { key: "artists",   label: "Total Artists",   bg: "#a01010", icon: <MicIcon size={28} color="#fff" /> },
  { key: "directors", label: "Total Directors", bg: "#5f032c", icon: <MusicStaffIcon size={28} color="#fff" /> },
  { key: "albums",    label: "Total Albums",    bg: "#3d0218", icon: <DiscIcon size={28} color="#fff" /> },
  { key: "users",     label: "Total Users",     bg: "#2c3e6b", icon: <UserIcon size={28} color="#fff" /> },
];

const ACTION_CARDS = [
  { icon: <MusicNoteIcon size={36} color="#fff" />,  title: "Manage Songs",     desc: "Add, edit, delete songs & control visibility", path: "/admin/songs" },
  { icon: <MicIcon size={36} color="#fff" />,        title: "Manage Artists",   desc: "Add or update artist information",             path: "/admin/artists" },
  { icon: <MusicStaffIcon size={36} color="#fff" />, title: "Manage Directors", desc: "Manage music directors",                       path: "/admin/directors" },
  { icon: <DiscIcon size={36} color="#fff" />,       title: "Manage Albums",    desc: "Add or update albums",                         path: "/admin/albums" },
  { icon: <UserIcon size={36} color="#fff" />,       title: "Manage Users",     desc: "View, edit and manage user accounts",          path: "/admin/users" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ songs: 0, artists: 0, directors: 0, albums: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [songs, artists, directors, albums, users] = await Promise.all([
          getSongs(), getArtists(), getDirectors(), getAlbums(), getUsers()
        ]);
        setStats({
          songs:     songs.data.length,
          artists:   artists.data.length,
          directors: directors.data.length,
          albums:    albums.data.length,
          users:     users.data.length,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>

      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: "56px", height: "56px", background: BRAND_COLOR, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <SettingsIcon size={26} color="#fff" />
        </div>
        <div>
          <h2 className="fw-bold mb-0" style={{ color: BRAND_COLOR }}>Admin Dashboard</h2>
          <p className="mb-0" style={{ color: "#777", fontSize: "0.9rem" }}>Manage your music library</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {STAT_CARDS.map(s => (
          <div key={s.key} className="col-6 col-md-4 col-lg">
            <div className="p-4 rounded-3 text-white text-center"
              style={{ background: s.bg, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="d-flex justify-content-center mb-2">{s.icon}</div>
              <h3 className="fw-bold display-6 mb-1">{stats[s.key]}</h3>
              <p className="mb-0" style={{ fontSize: "0.8rem", opacity: 0.8, letterSpacing: "0.5px" }}>
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h4 className="fw-bold mb-3" style={{ color: BRAND_COLOR }}>Quick Actions</h4>
      <div className="row g-3">
        {ACTION_CARDS.map(card => (
          <div key={card.path} className="col-md-6">
            <div className="d-flex align-items-center gap-0 rounded-3 overflow-hidden shadow-sm"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(0,0,0,0.07)",
                cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              onClick={() => navigate(card.path)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "90px", minHeight: "90px", background: THEME_BG,
                borderRight: `4px solid ${BRAND_COLOR}`, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ color: BRAND_COLOR }}>
                  {card.path === "/admin/songs"     && <MusicNoteIcon  size={36} color={BRAND_COLOR} />}
                  {card.path === "/admin/artists"   && <MicIcon         size={36} color={BRAND_COLOR} />}
                  {card.path === "/admin/directors" && <MusicStaffIcon  size={36} color={BRAND_COLOR} />}
                  {card.path === "/admin/albums"    && <DiscIcon        size={36} color={BRAND_COLOR} />}
                  {card.path === "/admin/users"     && <UserIcon        size={36} color={BRAND_COLOR} />}
                </div>
              </div>
              <div className="p-3 flex-grow-1">
                <h5 className="fw-bold mb-1" style={{ color: BRAND_COLOR, fontSize: "1.05rem" }}>{card.title}</h5>
                <p className="mb-0" style={{ color: "#666", fontSize: "0.875rem" }}>{card.desc}</p>
              </div>
              <div className="pe-3" style={{ color: "#bbb" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;