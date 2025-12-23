/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { postLogout, postRefresh } from "./auth-api";

const isProduction =
  import.meta.env.VITE_NODE_ENV === "production" ||
  import.meta.env.VITE_NODE_ENV === "PRODUCTION";

const baseURL = isProduction
  ? import.meta.env.BASE_URL
  : "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed, but with cookies they're automatic
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh for auth-related endpoints
    const authEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];
    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        await postLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await postRefresh();
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await postLogout();

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("authLogout"));
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      console.log("Forbidden access - insufficient permissions");
    }

    return Promise.reject(error);
  }
);
