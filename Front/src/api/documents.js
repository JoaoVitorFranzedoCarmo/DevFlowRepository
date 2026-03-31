// src/api/documents.js

import { get, post, put, del } from "./client";

export async function getDocuments(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  const query = params.toString();
  return get(`/documents${query ? `?${query}` : ""}`);
}

export async function getDocumentById(id) {
  return get(`/documents/${id}`);
}

export async function getDocumentStats() {
  return get("/documents/stats");
}

export async function getVersionHistory() {
  return get("/documents/versions");
}

export async function createDocument(data) {
  return post("/documents", data);
}

export async function updateDocument(id, data) {
  return put(`/documents/${id}`, data);
}

export async function deleteDocument(id) {
  return del(`/documents/${id}`);
}

export async function addDocumentVersion(documentId, data) {
  return post(`/documents/${documentId}/versions`, data);
}
