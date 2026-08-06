import api, { TOKEN_KEY } from "./client.js";

/*
  POST /login
  Request  : { email, password }
  Response : whatever the backend returns; we look for a JWT on
             access_token or token.

  If the backend uses different names, this file is the only place
  that needs to change.
*/
export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

// The request interceptor in client.js reads this key on every call,
// so storing it is all that is needed to authenticate.
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function readToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/*
  Turns an axios failure into one sentence a user can read.
  Handles FastAPI's two shapes: {detail: "msg"} and
  {detail: [{msg: "..."}]} from validation errors.
*/
export function readApiError(error) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach the server. Check that it is running on port 8000.";
  }
  if (error?.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
