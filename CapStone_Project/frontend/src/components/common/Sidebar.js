import { Link } from "react-router-dom";
import { HeadphonesIcon, FolderIcon, UserIcon, SettingsIcon, MusicNoteIcon, MicIcon, MusicStaffIcon, DiscIcon } from "./Icons";

function Sidebar() {

  const role = localStorage.getItem("role");

  return (
    <div
      style={{
        width: "220px",
        background: "#1e1e2f",
        color: "white",
        minHeight: "100vh"
      }}
    >

      <h4>Music Library</h4>

      <ul style={{ listStyle: "none", padding: 0 }}>

        <li>
          <Link to="/songs" className="d-flex align-items-center gap-2"><HeadphonesIcon size={16}/> Songs</Link>
        </li>

        <li>
          <Link to="/playlists" className="d-flex align-items-center gap-2"><FolderIcon size={16} /> Playlists</Link>
        </li>

        <li>
          <Link to="/profile" className="d-flex align-items-center gap-2"><UserIcon size={16} /> Profile</Link>
        </li>

        {role === "admin" && (
          <>
            <hr />

            <li>
              <Link to="/admin" className="d-flex align-items-center gap-2"><SettingsIcon size={16} /> Admin Dashboard</Link>
            </li>

            <li>
              <Link to="/admin/songs" className="d-flex align-items-center gap-2"><MusicNoteIcon size={16} /> Manage Songs</Link>
            </li>

            <li>
              <Link to="/admin/artists" className="d-flex align-items-center gap-2"><MicIcon size={16} /> Manage Artists</Link>
            </li>

            <li>
              <Link to="/admin/directors" className="d-flex align-items-center gap-2"><MusicStaffIcon size={16} /> Manage Directors</Link>
            </li>

            <li>
              <Link to="/admin/albums" className="d-flex align-items-center gap-2"><DiscIcon size={16} /> Manage Albums</Link>
            </li>

          </>
        )}

      </ul>

    </div>
  );
}

export default Sidebar;