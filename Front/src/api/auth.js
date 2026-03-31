// src/api/auth.js

import { post, get, setTokens, clearTokens } from "./client";

export async function login(email, password) {
  const data = await post("/auth/login", { email, password });
  setTokens(data.accessToken, data.refreshToken);
  localStorage.setItem("devflow_user", JSON.stringify(data.user));
  return data;
}

export async function register(name, email, password, role) {
  const data = await post("/auth/register", { name, email, password, role });
  setTokens(data.accessToken, data.refreshToken);
  localStorage.setItem("devflow_user", JSON.stringify(data.user));
  return data;
}

export async function logout() {
  const refresh = localStorage.getItem("devflow_refresh");
  try {
    if (refresh) {
      await post("/auth/logout", { refreshToken: refresh });
    }
  } catch {
    // Ignore errors on logout
  }
  clearTokens();
  localStorage.removeItem("devflow_user");
}

export async function getMe() {
  return get("/auth/me");
}

export function getStoredUser() {
  try {
    const stored = localStorage.getItem("devflow_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("devflow_token");
}
