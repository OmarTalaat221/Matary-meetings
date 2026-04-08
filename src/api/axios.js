import axios from "axios";
import { getToken, clearAuth } from "../utils/token";

const BASE_URL = "https://dr-elmatary.com/mtrymting/doctor";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔒 Unauthorized - Logging out...");

      clearAuth();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
