import axios from "axios";

const TOKEN_KEY = "job_board_token";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (!token) {
      localStorage.removeItem(TOKEN_KEY);
      delete api.defaults.headers.common.Authorization;
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

setAuthToken(getAuthToken());

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return "Something went wrong";
  const data = error.response?.data;
  if (typeof data?.message === "string") return data.message;
  return error.message || "Request failed";
}
