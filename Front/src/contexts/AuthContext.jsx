// src/contexts/AuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authApi.getStoredUser());
  const [loading, setLoading] = useState(true);

  // Check if user session is still valid on mount
  useEffect(() => {
    async function checkAuth() {
      if (authApi.isAuthenticated()) {
        try {
          const me = await authApi.getMe();
          setUser(me);
          localStorage.setItem("devflow_user", JSON.stringify(me));
        } catch {
          setUser(null);
          authApi.logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  // Listen for forced logout (token refresh failed)
  useEffect(() => {
    function handleLogout() {
      setUser(null);
    }
    window.addEventListener("devflow:logout", handleLogout);
    return () => window.removeEventListener("devflow:logout", handleLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    const data = await authApi.register(name, email, password, role);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("devflow_user", JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
