// src/api/notifications.js

import { get, put } from "./client";

export async function getNotificationSettings() {
  return get("/notifications");
}

export async function updateNotificationSetting(data) {
  return put("/notifications", data);
}

export async function bulkUpdateNotifications(settings) {
  return put("/notifications/bulk", { settings });
}
