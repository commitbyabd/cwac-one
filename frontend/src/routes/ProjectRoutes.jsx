import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import Signup from "../pages/sign-up/Signup.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";

/*
  The single route table for the whole app.
  Add one <Route> per screen here; each element points at a
  page in src/pages, never at a component directly.
*/
function ProjectRoutes() {
  return (
    <Routes>
      {/* Landing — no home screen yet, so send visitors to signup */}
      <Route path="/" element={<Navigate to="/signup" replace />} />

      {/* Public */}
      <Route path="/signup" element={<Signup />} />

      {/*
        Private. The guard carries no path of its own — it exists purely to
        wrap what is nested below, so anything added here is protected by
        default rather than by remembering to opt in.
      */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Unknown URL — swap for a NotFound page when one exists */}
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default ProjectRoutes;
