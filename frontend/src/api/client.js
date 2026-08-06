import axios from "axios";

/*
  One axios instance for the whole app.
  Override the host without touching code by setting VITE_API_BASE_URL
  in a .env file; otherwise it talks to the local backend.
*/
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});
// The localStorage key the JWT is stored under. Lives here because the
// interceptor below needs it, and auth.js imports from this file (not the
// other way around).
export const TOKEN_KEY = "cwac_token";

//An interceptor is a function axios runs on every outgoing request before it leaves. You get the config, mutate it, return it.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/*
  Response interceptor — the mirror of the one above. The first argument
  runs on success and passes the response through untouched; the second
  runs on failure.

  A 401 anywhere except the login call itself means the token expired or
  was tampered with, so the stored one is worthless. Drop it and send the
  user back to sign in. The login call is excluded because a 401 there
  just means wrong credentials, and LoginForm already shows that message.
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url ?? "";

    if (status === 401 && !url.includes("/auth/login")) {
      localStorage.removeItem(TOKEN_KEY);

      // A full page load, not a router navigation: this file is plain JS
      // outside the React tree, so hooks like useNavigate are unavailable.
      // The guard stops a redirect loop if we are already on the page.
      if (window.location.pathname !== "/signup") {
        window.location.replace("/signup");
      }
    }

    // Re-throw so the calling component's catch block still runs.
    return Promise.reject(error);
  },
);

export default api;
