import { Navigate, Outlet, useLocation } from "react-router-dom";
import { readToken } from "../api/auth.js";

/*
  Layout route guarding the private area.

  A usability guard, not a security boundary: the bundle is already in the
  browser. Access control lives on the API, which rejects any request
  without a valid token.
*/
function ProtectedRoutes() {
  const location = useLocation();

  // Presence only. Validity is the server's verdict, handled by the 401
  // interceptor in client.js.
  if (!readToken()) {
    // state.from is unused so far; it is what a "return to where you were
    // headed" redirect would be built on.
    return <Navigate to="/signup" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
