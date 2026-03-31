// src/api/templates.js

import { get, post, put, del } from "./client";

export async function getTemplates() {
  return get("/templates");
}

export async function getTemplateById(id) {
  return get(`/templates/${id}`);
}

export async function createTemplate(data) {
  return post("/templates", data);
}

export async function updateTemplate(id, data) {
  return put(`/templates/${id}`, data);
}

export async function deleteTemplate(id) {
  return del(`/templates/${id}`);
}

export async function useTemplate(id) {
  return post(`/templates/${id}/use`);
}
