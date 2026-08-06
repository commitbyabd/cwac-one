import api, { TOKEN_KEY, USER_KEY } from "./client.js";

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

/*
  The signed-in user's display details, kept beside the token.

  The JWT carries only the id and the role, so the name comes back once in
  the login response and is cached here rather than re-fetched on every
  screen. It is display data only — never trust it for a decision the
  server should be making.
*/
export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function readUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  // Hand-edited or half-written storage should log the user out, not crash
  // the component that asked for a name.
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Sign out. Clears both halves of the session so no stale name outlives
// the token that authorised it.
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/*
  Turns an axios failure into one sentence a user can read.

  The API speaks in three shapes:
    - {message: "..."}        the api_response envelope, used by /admin
    - {detail: "..."}         a plain HTTPException, used by /auth/login
    - {detail: [{msg: "..."}]} Pydantic validation errors

  The envelope is checked first because its message is written for the
  user, while 'detail' tends to be written for the developer.
*/
export function readApiError(error) {
  const body = error?.response?.data;

  if (typeof body?.message === "string") return body.message;

  const detail = body?.detail;

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
