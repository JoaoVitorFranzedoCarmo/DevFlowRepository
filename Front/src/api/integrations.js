// src/api/integrations.js

import { get, post, put, patch, del } from "./client";

export async function getIntegrations() {
  return get("/integrations");
}

export async function createIntegration(data) {
  return post("/integrations", data);
}

export async function updateIntegration(id, data) {
  return put(`/integrations/${id}`, data);
}

export async function toggleIntegration(id) {
  return patch(`/integrations/${id}/toggle`);
}

export async function deleteIntegration(id) {
  return del(`/integrations/${id}`);
}
