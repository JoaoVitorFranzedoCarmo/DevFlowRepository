// src/api/tasks.js

import { get, post, put, patch, del } from "./client";

export async function getTasks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.assigneeId) params.set("assigneeId", filters.assigneeId);
  if (filters.search) params.set("search", filters.search);
  const query = params.toString();
  return get(`/tasks${query ? `?${query}` : ""}`);
}

export async function getTaskById(id) {
  return get(`/tasks/${id}`);
}

export async function getKanbanBoard() {
  return get("/tasks/kanban");
}

export async function getPrioritizedTasks() {
  return get("/tasks/prioritized");
}

export async function getDashboardStats() {
  return get("/tasks/dashboard/stats");
}

export async function createTask(data) {
  return post("/tasks", data);
}

export async function updateTask(id, data) {
  return put(`/tasks/${id}`, data);
}

export async function moveTask(id, status) {
  return patch(`/tasks/${id}/move`, { status });
}

export async function deleteTask(id) {
  return del(`/tasks/${id}`);
}

export async function setPrioritization(taskId, data) {
  return put(`/tasks/${taskId}/prioritization`, data);
}

export async function addDependency(sourceTaskId, targetTaskId) {
  return post(`/tasks/${sourceTaskId}/dependencies`, { targetTaskId });
}

export async function removeDependency(sourceTaskId, targetTaskId) {
  return del(`/tasks/${sourceTaskId}/dependencies/${targetTaskId}`);
}
