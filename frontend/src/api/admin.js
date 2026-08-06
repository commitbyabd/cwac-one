import api from "./client.js";

/*
  Every endpoint the admin dashboard talks to, mirroring
  app/features/admin/route.py one-for-one.

  All of these are behind require_role("admin") on the server, so they only
  work while an admin token is in localStorage — client.js attaches it.

  Each one returns the backend's envelope, unwrapped one level from axios:

      { status_code, message, success, data, error_code }

  so callers read the payload off .data and the human-readable text off
  .message:

      const { data } = await listDoctors();

  Non-2xx responses reject, as axios does by default, and land in the
  caller's catch block with the envelope on error.response.data.
*/
const unwrap = async (request) => {
  const { data } = await request;
  return data;
};

/* ---------------------------------------------------------------- doctors */

// GET /admin/doctors -> data: array of active doctors
export const listDoctors = () => unwrap(api.get("/admin/doctors"));

/*
  GET /admin/doctors/{id} -> data: one doctor

  Unused for now: the list already returns every field the cards show. Kept
  for the detail view, once a doctor record carries more than the list is
  willing to send.
*/
export const getDoctor = (doctorId) => unwrap(api.get(`/admin/doctors/${doctorId}`));

// POST /admin/doctors -> data: { id } of the new doctor
// payload: { full_name, email, password, specialization }
export const createDoctor = (payload) => unwrap(api.post("/admin/doctors", payload));

// PATCH /admin/doctors/{id}
// payload: { full_name, email, specialization } — all optional
export const updateDoctor = (doctorId, payload) =>
  unwrap(api.patch(`/admin/doctors/${doctorId}`, payload));

/*
  Deactivate and reactivate flip is_active rather than deleting the record,
  so appointment history keeps pointing at a doctor that still exists.
*/
export const deactivateDoctor = (doctorId) =>
  unwrap(api.patch(`/admin/doctors/${doctorId}/deactivate`));

export const reactivateDoctor = (doctorId) =>
  unwrap(api.patch(`/admin/doctors/${doctorId}/reactivate`));

/* ---------------------------------------------------------- receptionists */

// GET /admin/receptionists -> data: array of active receptionists
export const listReceptionists = () => unwrap(api.get("/admin/receptionists"));

/*
  GET /admin/receptionists/{id} -> data: one receptionist

  Unused for now, for the same reason as getDoctor: the list carries
  everything the current screens need. Kept for the detail view.
*/
export const getReceptionist = (receptionistId) =>
  unwrap(api.get(`/admin/receptionists/${receptionistId}`));

// POST /admin/receptionists -> data: { id } of the new receptionist
// payload: { full_name, email, password } — no specialization
export const createReceptionist = (payload) =>
  unwrap(api.post("/admin/receptionists", payload));

// PATCH /admin/receptionists/{id}
// payload: { full_name, email } — all optional
export const updateReceptionist = (receptionistId, payload) =>
  unwrap(api.patch(`/admin/receptionists/${receptionistId}`, payload));

export const deactivateReceptionist = (receptionistId) =>
  unwrap(api.patch(`/admin/receptionists/${receptionistId}/deactivate`));

export const reactivateReceptionist = (receptionistId) =>
  unwrap(api.patch(`/admin/receptionists/${receptionistId}/reactivate`));
