import { Stethoscope, ConciergeBell, UserX } from "lucide-react";
import {
  listDoctors,
  listReceptionists,
  deactivateDoctor,
  deactivateReceptionist,
} from "../api/admin.js";

/*
  The single description of each staff list: what the sidebar calls it, what
  the section header says, and which endpoints it talks to.

  Both the nav and the list read from here, so a wording change lands in one
  place. A third kind of staff is a new entry, not another branch.
*/
export const STAFF_VIEWS = [
  {
    slug: "doctors",
    title: "Doctors",
    subtitle: "Clinicians taking appointments",
    icon: Stethoscope,
    kind: "doctor",
    noun: "doctor",
    role: "Doctor",
    fetchList: listDoctors,
    deactivate: deactivateDoctor,
  },
  {
    slug: "receptionists",
    title: "Receptionists",
    subtitle: "Front desk and scheduling",
    icon: ConciergeBell,
    kind: "receptionist",
    noun: "receptionist",
    role: "Receptionist",
    fetchList: listReceptionists,
    deactivate: deactivateReceptionist,
  },
  {
    slug: "deactivated",
    title: "Deactivated users",
    subtitle: "Accounts without access",
    icon: UserX,
    // No endpoint lists deactivated staff yet, so this view has nothing to
    // fetch. 'unavailable' is what the section renders instead.
    unavailable:
      "Deactivated staff cannot be listed yet. The API endpoint for this view has not been built.",
  },
];

export const DEFAULT_VIEW_SLUG = "doctors";

export function findView(slug) {
  return STAFF_VIEWS.find((view) => view.slug === slug);
}
