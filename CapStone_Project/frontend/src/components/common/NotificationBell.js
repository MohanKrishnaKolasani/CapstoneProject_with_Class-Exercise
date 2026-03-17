import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { BellIcon } from "./Icons";

const ICON_COLOR  = "#1d2306";
const BRAND_COLOR = "#7e0404";

function NotificationBell() {
  const { notifications, hasNew, markAsRead, markAllAsRead, clearNew } = useNotifications();
  const [open, setOpen]     = useState(false);
  const dropdownRef          = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="btn btn-sm d-flex align-items-center justify-content-center position-relative"
        onClick={() => { setOpen(prev => !prev); clearNew(); }}
        style={{ width: "40px", height: "40px", borderRadius: "50%", border: `2px solid ${hasNew ? BRAND_COLOR : ICON_COLOR}`, background: hasNew ? "rgba(126,4,4,0.08)" : "transparent", color: ICON_COLOR, transition: "background 0.3s, border-color 0.3s" }}
        onMouseEnter={e => { e.currentTarget.style.background = ICON_COLOR; e.currentTarget.querySelector("svg").style.stroke = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = hasNew ? "rgba(126,4,4,0.08)" : "transparent"; e.currentTarget.querySelector("svg").style.stroke = ICON_COLOR; }}
        title="Notifications"
      >
        <BellIcon size={20} color={ICON_COLOR} />
        {notifications.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.65rem" }}>
            {notifications.length}<span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </button>

      {open && (
        <div className="card shadow-lg border-0" style={{ position: "fixed", top: "70px", left: "50%", transform: "translateX(-50%)", width: "min(320px, calc(100vw - 24px))", zIndex: 1050, borderRadius: "12px", overflow: "hidden" }}>
          <div className="d-flex justify-content-between align-items-center px-3 py-2 fw-bold" style={{ background: BRAND_COLOR, color: "#fff" }}>
            <span>Notifications</span>
            <div className="d-flex align-items-center gap-2">
              {notifications.length > 0 && <span className="badge rounded-pill" style={{ background: "rgba(255,255,255,0.25)", fontSize: "0.75rem" }}>{notifications.length} new</span>}
              {notifications.length > 1 && <button className="btn btn-sm py-0 px-2" style={{ fontSize: "0.72rem", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "20px" }} onClick={markAllAsRead}>Clear all</button>}
            </div>
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <BellIcon size={28} color="#ccc" />
                <p className="mb-0 mt-2">All caught up!</p>
                <small>No new notifications</small>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n._id} className="d-flex flex-column gap-2 p-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <p className="mb-0 text-dark" style={{ fontSize: "0.875rem" }}>{n.message}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small style={{ color: "#999" }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
                    <button className="btn btn-sm rounded-pill px-3" style={{ fontSize: "0.75rem", border: `1px solid ${BRAND_COLOR}`, color: BRAND_COLOR, background: "transparent" }} onClick={() => markAsRead(n._id)}>Mark as read</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: "6px 12px", borderTop: "1px solid rgba(0,0,0,0.06)", background: "#fafafa" }}>
            <small style={{ color: "#bbb", fontSize: "0.7rem" }}>Auto-refreshes every 30 seconds</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
