import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  MusicNoteIcon, HeadphonesIcon, FolderIcon, UserIcon,
  SettingsIcon, MicIcon, MusicStaffIcon, DiscIcon,
} from "./Icons";
import "./Navbar.css";

const BRAND_COLOR    = "#7e0404";
const NAV_LINK_COLOR = "#7e0404";
const ICON_COLOR     = "#5f032c";
const NAV_BG         = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";

function Navbar() {
  const navigate        = useNavigate();
  const { isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu  = () => setIsOpen(false);

  const navLink = (to, icon, label) => (
    <li className="nav-item">
      <Link
        className="nav-link d-flex align-items-center gap-2 nav-hover-link"
        to={to}
        onClick={closeMenu}
      >
        {icon} {label}
      </Link>
    </li>
  );

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm"
      style={{ background: NAV_BG }}
    >
      <div className="container-fluid">

        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2 nav-hover-link"
          to={isAdmin ? "/admin" : "/songs"}
          onClick={closeMenu}
        >
          <MusicNoteIcon size={20} color={ICON_COLOR} />
          Music Library
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ borderColor: BRAND_COLOR }}
        >
          <span
            className="navbar-toggler-icon"
            style={{ filter: "invert(0) brightness(0)", opacity: 0.7 }}
          />
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            {isAdmin ? (
              <>
                {navLink("/admin",           <SettingsIcon   size={16} color={ICON_COLOR} />, "Admin Dashboard")}
                {navLink("/admin/songs",     <MusicNoteIcon  size={16} color={ICON_COLOR} />, "Manage Songs")}
                {navLink("/admin/artists",   <MicIcon        size={16} color={ICON_COLOR} />, "Manage Artists")}
                {navLink("/admin/directors", <MusicStaffIcon size={16} color={ICON_COLOR} />, "Manage Directors")}
                {navLink("/admin/albums",    <DiscIcon       size={16} color={ICON_COLOR} />, "Manage Albums")}
                {navLink("/admin/users",     <UserIcon       size={16} color={ICON_COLOR} />, "Manage Users")}
              </>
            ) : (
              <>
                {navLink("/songs",     <HeadphonesIcon size={16} color={ICON_COLOR} />, "Songs")}
                {navLink("/playlists", <FolderIcon     size={16} color={ICON_COLOR} />, "Playlists")}
                {navLink("/library",   <DiscIcon       size={16} color={ICON_COLOR} />, "Library")}
                {navLink("/profile",   <UserIcon       size={16} color={ICON_COLOR} />, "Profile")}
              </>
            )}

          </ul>

          <div className="d-flex align-items-center gap-3 mt-2 mt-lg-0">
            <NotificationBell />
            <button
              className="btn btn-sm"
              style={{
                color: NAV_LINK_COLOR,
                border: `2px solid ${NAV_LINK_COLOR}`,
                background: "transparent",
                borderRadius: "6px",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = NAV_LINK_COLOR;
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = NAV_LINK_COLOR;
              }}
              onClick={() => { closeMenu(); handleLogout(); }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;