import { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import { UserIcon } from "../../components/common/Icons";

const THEME_BG    = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
const BRAND_COLOR = "#7e0404";

function ProfilePage() {
  const [user, setUser]       = useState(null);
  const [image, setImage]     = useState(null);
  const [message, setMessage] = useState("");

  const fetchProfile = () => {
    API.get("/auth/profile")
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchProfile(); }, []);

  const uploadProfilePicture = () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("profilePicture", image);
    API.post("/auth/profile-picture", formData)
      .then(() => {
        setMessage("Profile picture updated successfully!");
        setImage(null);
        fetchProfile();
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => console.error(err));
  };

  const getProfilePicUrl = (picPath) => {
    if (!picPath) return null;
    const clean = picPath.replace(/^\//, "");
    return `http://localhost:5000/${clean}`;
  };

  if (!user) return (
    <div className="d-flex align-items-center gap-2 mt-4">
      <div className="spinner-border spinner-border-sm" style={{ color: BRAND_COLOR }} role="status" />
      <span style={{ color: BRAND_COLOR }}>Loading...</span>
    </div>
  );

  return (
    <div>

      {/* Heading */}
      <h2 className="d-flex align-items-center justify-content-center gap-2 mb-4"
        style={{ color: BRAND_COLOR }}>
        <UserIcon size={24} color={BRAND_COLOR} /> My Profile
      </h2>

      {/* Card — full width on mobile, capped on larger screens */}
      <div
        className="p-3 p-sm-4 rounded-3 shadow-sm mx-auto"
        style={{
          background: THEME_BG,
          border: "1px solid rgba(0,0,0,0.07)",
          maxWidth: "480px",
          width: "100%",
        }}
      >

        {/* Avatar + Name */}
        <div className="d-flex align-items-center gap-3 mb-4">
          {user.profilePicture ? (
            <img
              src={getProfilePicUrl(user.profilePicture)}
              alt="profile"
              style={{
                width: "80px", height: "80px",
                borderRadius: "50%", objectFit: "cover",
                border: `3px solid ${BRAND_COLOR}`,
                flexShrink: 0,
              }}
              onError={e => { e.target.style.display = "none"; }}
            />
          ) : (
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "rgba(0,0,0,0.08)", display: "flex",
              alignItems: "center", justifyContent: "center",
              border: `3px solid ${BRAND_COLOR}`, flexShrink: 0,
            }}>
              <UserIcon size={36} color={BRAND_COLOR} />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <h5 className="fw-bold mb-1 text-truncate" style={{ color: BRAND_COLOR }}>
              {user.name}
            </h5>
            <div style={{ fontSize: "0.85rem", color: "#666", textTransform: "capitalize" }}>
              {user.roleId?.roleName || "User"}
            </div>
          </div>
        </div>

        {/* Info rows — label on top, value below on small screens */}
        <div
          className="mb-4 rounded-3 p-3"
          style={{ background: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}
        >
          <div className="py-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ color: "#888", marginBottom: "2px" }}>Email</div>
            <div style={{ color: "#333", wordBreak: "break-all" }}>{user.email}</div>
          </div>
          <div className="py-2">
            <div style={{ color: "#888", marginBottom: "2px" }}>Phone</div>
            <div style={{ color: "#333" }}>{user.phone}</div>
          </div>
        </div>

        {/* Upload */}
        <div>
          <label style={{ fontSize: "0.85rem", color: "#666", marginBottom: "6px", display: "block" }}>
            Update profile picture
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {message && (
            <div className="alert alert-success py-2 px-3 mb-3" style={{ fontSize: "0.875rem" }} role="alert">
              {message}
            </div>
          )}

          <button
            style={{
              background: image ? BRAND_COLOR : "rgba(0,0,0,0.15)",
              color: "#fff", border: "none", borderRadius: "6px",
              padding: "9px 20px", fontWeight: "500",
              cursor: image ? "pointer" : "not-allowed",
              width: "100%", transition: "opacity 0.2s",
              fontSize: "0.9rem",
            }}
            onMouseEnter={e => { if (image) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            onClick={uploadProfilePicture}
            disabled={!image}
          >
            Upload Profile Picture
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;