// src/api/index.js

export * as authApi from "./auth";
export * as tasksApi from "./tasks";
export * as componentsApi from "./components";
export * as lessonsApi from "./lessons";
export * as documentsApi from "./documents";
export * as templatesApi from "./templates";
export * as usersApi from "./users";
export * as integrationsApi from "./integrations";
export * as notificationsApi from "./notifications";
export { api, setTokens, clearTokens } from "./client";
