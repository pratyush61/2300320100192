// src/services/api.js
import axios from "axios";

const BASE_URL = "http://4.224.186.213/evaluation-service";

// Axios instance — token is added dynamically
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth APIs ────────────────────────────────────────────────

/**
 * Register and get clientID + clientSecret
 */
export const register = (data) =>
  api.post("/register", data).then((r) => r.data);

/**
 * Authenticate and get access_token
 */
export const authenticate = (data) =>
  api.post("/auth", data).then((r) => r.data);

// ── Notifications API ────────────────────────────────────────

/**
 * Fetch notifications
 * @param {object} params  - { page, limit, notification_type }
 */
export const fetchNotifications = (params = {}) =>
  api.get("/notifications", { params }).then((r) => r.data);
