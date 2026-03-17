import { createContext, useState, useEffect, useCallback } from "react";
import { getProfile } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken]     = useState(() => localStorage.getItem("token"));
  const [role, setRole]       = useState(() => localStorage.getItem("role"));
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  const login = useCallback((newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  }, []);

  useEffect(() => {
    if (!token) { setUser(null); setLoading(false); return; }
    setLoading(true);
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      role,
      isAuthenticated: !!token,
      isAdmin: role === "admin",
      loading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};