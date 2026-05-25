import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

if (import.meta.env.PROD && API_BASE_URL.includes("localhost")) {
  console.error(
    "[SubTracker] VITE_API_URL is missing in the production build — signup/API calls will fail. Set it in Amplify Environment variables to https://subtracker-1-tsuh.onrender.com/api and redeploy."
  );
}

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Handle errors globally (optional)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default API;