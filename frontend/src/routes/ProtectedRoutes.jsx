import { Navigate, Outlet, useLocation } from "react-router-dom";
import { readToken } from "../api/auth.js";

/*
  Guard for the private area of the app.

  Used as a layout route, so every <Route> nested inside it inherits the
  check and new private screens need no guard code of their own.

  This is a usability guard, not a security boundary — the page bundle is
  already in the browser and could be forced to render by hand. Real access
  control lives on the API, which rejects any request without a valid token;
  a forced render would simply come up empty.
*/
function ProtectedRoutes() {
  const location = useLocation();

  /*
    Only presence is checked. Whether the token is still valid is the
    server's verdict, and the 401 handler in client.js acts on it — so an
    expired token gets one failed request before the user is signed out,
    rather than being caught here.
  */
  if (!readToken()) {
    /*
      'replace' drops the blocked URL from history instead of stacking on
      top of it, so Back cannot bounce the user into the redirect again.

      'state.from' records where they were headed. Nothing reads it yet;
      it is what a "return to the page you wanted" redirect after login
      would be built on.
    */
    return <Navigate to="/signup" replace state={{ from: location }} />;
  }

  // Renders whichever nested route matched.
  return <Outlet />;
}

export default ProtectedRoutes;
