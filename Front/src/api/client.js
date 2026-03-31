// src/api/client.js

const API_BASE = "http://localhost:3001/api";

let accessToken = localStorage.getItem("devflow_token") || null;
let refreshTokenValue = localStorage.getItem("devflow_refresh") || null;

export function setTokens(access, refresh) {
  accessToken = access;
  refreshTokenValue = refresh;
  if (access) {
    localStorage.setItem("devflow_token", access);
  } else {
    localStorage.removeItem("devflow_token");
  }
  if (refresh) {
    localStorage.setItem("devflow_refresh", refresh);
  } else {
    localStorage.removeItem("devflow_refresh");
  }
}

export function getAccessToken() {
  return accessToken;
}

export function clearTokens() {
  accessToken = null;
  refreshTokenValue = null;
  localStorage.removeItem("devflow_token");
  localStorage.removeItem("devflow_refresh");
  localStorage.removeItem("devflow_user");
}

async function refreshAccessToken() {
  if (!refreshTokenValue) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(url, { ...options, headers });

  // If 401, try to refresh token
  if (res.status === 401 && refreshTokenValue) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      res = await fetch(url, { ...options, headers });
    } else {
      // Redirect to login
      window.dispatchEvent(new CustomEvent("devflow:logout"));
      throw new Error("Sessão expirada");
    }
  }

  if (res.status === 204) {
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || "Erro na requisição");
    error.status = res.status;
    error.details = data.details;
    throw error;
  }

  return data;
}

// Shorthand methods
export const get = (endpoint) => api(endpoint);
export const post = (endpoint, body) =>
  api(endpoint, { method: "POST", body: JSON.stringify(body) });
export const put = (endpoint, body) =>
  api(endpoint, { method: "PUT", body: JSON.stringify(body) });
export const patch = (endpoint, body) =>
  api(endpoint, { method: "PATCH", body: JSON.stringify(body) });
export const del = (endpoint) => api(endpoint, { method: "DELETE" });
