import { useState, useCallback } from "react";
import API from "../api/axiosConfig";

export const useProfile = () => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    API.get("/auth/profile")
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useState(() => { refresh(); });

  const uploadPicture = useCallback((file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePicture", file);
    return API.post("/auth/profile-picture", formData)
      .then(() => {
        setMessage("Profile picture updated successfully!");
        setTimeout(() => setMessage(""), 3000);
        refresh();
      })
      .catch((err) => console.error(err));
  }, [refresh]);

  return { user, loading, message, refresh, uploadPicture };
};
