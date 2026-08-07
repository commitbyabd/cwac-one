import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import Signup from "../pages/sign-up/Signup.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";

// Route table for the whole app. Each element points at a page in
// src/pages, never at a component directly.
function ProjectRoutes() {
  return (
    <Routes>
      {/* No landing screen yet */}
      <Route path="/" element={<Navigate to="/signup" replace />} />

      <Route path="/signup" element={<Signup />} />

      {/* Pathless layout route: anything nested here is guarded by default */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* TODO: replace with a NotFound page */}
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default ProjectRoutes;
