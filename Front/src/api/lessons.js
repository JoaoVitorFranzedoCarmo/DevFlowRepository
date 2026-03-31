// src/api/lessons.js

import { get, post, put, del } from "./client";

export async function getLessons(search) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return get(`/lessons${query}`);
}

export async function getLessonById(id) {
  return get(`/lessons/${id}`);
}

export async function createLesson(data) {
  return post("/lessons", data);
}

export async function updateLesson(id, data) {
  return put(`/lessons/${id}`, data);
}

export async function deleteLesson(id) {
  return del(`/lessons/${id}`);
}
