import { useState, useEffect, useRef, useCallback } from "react";
import API from "../api/axiosConfig";

const POLL_INTERVAL = 30000;

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew]               = useState(false);
  const prevCountRef                       = useRef(0);

  const fetch = useCallback(() => {
    API.get("/notifications")
      .then((res) => {
        const unread = res.data.filter((n) => !n.isRead);
        setNotifications(unread);
        if (unread.length > prevCountRef.current) {
          setHasNew(true);
          setTimeout(() => setHasNew(false), 2000);
        }
        prevCountRef.current = unread.length;
      })
      .catch((err) => console.error("Notification fetch error:", err));
  }, []);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetch]);

  const markAsRead = useCallback((id) => {
    API.patch(`/notifications/${id}/read`)
      .then(() => {
        setNotifications((prev) => {
          const updated = prev.filter((n) => n._id !== id);
          prevCountRef.current = updated.length;
          return updated;
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const markAllAsRead = useCallback(() => {
    Promise.all(notifications.map((n) => API.patch(`/notifications/${n._id}/read`)))
      .then(() => { setNotifications([]); prevCountRef.current = 0; })
      .catch((err) => console.error(err));
  }, [notifications]);

  const clearNew = useCallback(() => setHasNew(false), []);

  return { notifications, hasNew, markAsRead, markAllAsRead, clearNew };
};
