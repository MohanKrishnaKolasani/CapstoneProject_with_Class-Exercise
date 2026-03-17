import { useState, useEffect, useCallback } from "react";
import { getUsers, updateUser, deleteUser } from "../services/userService";

export const useAdminUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const fetch = useCallback(() => {
    setLoading(true);
    getUsers()
      .then(res => { setUsers(res.data); setError(""); })
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const update = useCallback((id, data) =>
    updateUser(id, data).then(fetch), [fetch]);

  const remove = useCallback((id) =>
    deleteUser(id).then(fetch), [fetch]);

  return { users, loading, error, update, remove, refresh: fetch };
};
