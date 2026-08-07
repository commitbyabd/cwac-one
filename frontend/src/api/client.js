import axios from "axios";

// Storage keys live here rather than in auth.js because the interceptors
// below need them and auth.js already imports from this module.
export const TOKEN_KEY = "cwac_token";
export const USER_KEY = "cwac_user";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Read from storage on every request, not once at login: a page reload
// clears anything held in memory but leaves localStorage intact.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 outside the login call means the token expired or was tampered
// with. On the login call it means wrong credentials, which LoginForm
// reports itself.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url ?? "";

    if (status === 401 && !url.includes("/auth/login")) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // Full page load rather than a router navigation: this module sits
      // outside the React tree, so useNavigate is unavailable.
      if (window.location.pathname !== "/signup") {
        window.location.replace("/signup");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
