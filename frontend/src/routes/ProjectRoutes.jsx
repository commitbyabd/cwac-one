import { Routes, Route, Navigate } from "react-router-dom";
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

      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Unknown URL — swap for a NotFound page when one exists */}
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default ProjectRoutes;
