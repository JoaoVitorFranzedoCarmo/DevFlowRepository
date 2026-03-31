// src/api/users.js

import { get, put, del } from "./client";

export async function getUsers() {
  return get("/users");
}

export async function getUserById(id) {
  return get(`/users/${id}`);
}

export async function updateUser(id, data) {
  return put(`/users/${id}`, data);
}

export async function deleteUser(id) {
  return del(`/users/${id}`);
}
