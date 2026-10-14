import axios from "axios";

export const AUTH_TOKEN_STORAGE_KEY = "kurio_auth_token";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (token && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});
