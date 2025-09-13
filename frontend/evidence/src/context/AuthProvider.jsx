// src/context/AuthContext.jsx
import { useState, useEffect } from "react";
import { getMe } from "../api/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info if token exists
  useEffect(() => {
    setLoading(true);
    if (token) {
      getMe(token)
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Login function: set token, fetch user, set loading
  const login = async (token, user) => {
    setLoading(true);
    setToken(token);
    localStorage.setItem("token", token);
    try {
      const res = await getMe(token);
      setUser(res.data);
    } catch {
      setUser(user || null);
    } finally {
      setLoading(false);
    }
  };

  // Logout function: clear everything
  const logout = () => {
    setLoading(true);
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
