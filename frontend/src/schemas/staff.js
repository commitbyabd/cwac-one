import { z } from "zod";

/*
  The client-side mirror of the staff schemas in app/schemas/.

  Every rule here matches a Field(...) constraint on the server, so this file
  is the one place to look when a backend limit changes. Nothing enforces the
  match automatically — the server still validates and still wins — but the
  rules are at least written down once instead of scattered through the form
  as hand-written ifs.

    doctorCreate       → DoctorCreate       (app/schemas/doctor_create.py)
    doctorUpdate       → DoctorUpdate       (app/schemas/doctor_update.py)
    receptionistCreate → ReceptionistCreate (app/schemas/receptionist_create.py)
    receptionistUpdate → ReceptionistUpdate (app/schemas/receptionist_update.py)
*/

// Field(..., min_length=2, max_length=100)
const fullName = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters.")
  .max(100, "Full name cannot be longer than 100 characters.");

/*
  EmailStr = Field(..., max_length=254) — the RFC 5321 limit.

  The trim has to happen in a separate step piped into the format check,
  not chained after it. Zod runs checks in the order they are written, so
  z.email().trim() would test " sara@clinic.com " for validity while the
  spaces are still attached and reject a perfectly good pasted address.
*/
const email = z
  .string()
  .trim()
  .pipe(
    z
      .email("Enter a valid email address.")
      .max(254, "Email address cannot be longer than 254 characters."),
  );

// Field(..., min_length=2, max_length=100)
const specialization = z
  .string()
  .trim()
  .min(2, "Specialization must be at least 2 characters.")
  .max(100, "Specialization cannot be longer than 100 characters.");

/*
  SecretStr = Field(..., min_length=8, max_length=64)

  Never trimmed, unlike every field above: leading and trailing spaces are
  legitimate password characters, and the hash has to match what was typed.
  The 64 ceiling is the server's, and it exists because bcrypt ignores
  anything past 72 bytes.
*/
const password = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(64, "Password cannot be longer than 64 characters.");

export const doctorCreateSchema = z.object({
  full_name: fullName,
  email,
  password,
  specialization,
});

export const receptionistCreateSchema = z.object({
  full_name: fullName,
  email,
  password,
});

/*
  The update schemas deliberately differ from their Pydantic counterparts.

  DoctorUpdate and ReceptionistUpdate allow every field to be None, because
  the endpoint accepts a partial patch. The edit form is not partial — it
  shows both fields already filled in and always submits both — so leaving
  one blank is a mistake to catch here, not a patch to send.
*/
export const doctorUpdateSchema = z.object({
  full_name: fullName,
  email,
  specialization,
});

export const receptionistUpdateSchema = z.object({
  full_name: fullName,
  email,
});
