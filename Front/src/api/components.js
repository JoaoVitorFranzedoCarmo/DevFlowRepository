// src/api/components.js

import { get, post, put, del } from "./client";

export async function getComponents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.lang) params.set("lang", filters.lang);
  if (filters.search) params.set("search", filters.search);
  const query = params.toString();
  return get(`/components${query ? `?${query}` : ""}`);
}

export async function getComponentById(id) {
  return get(`/components/${id}`);
}

export async function getComponentStats() {
  return get("/components/stats");
}

export async function createComponent(data) {
  return post("/components", data);
}

export async function updateComponent(id, data) {
  return put(`/components/${id}`, data);
}

export async function deleteComponent(id) {
  return del(`/components/${id}`);
}
