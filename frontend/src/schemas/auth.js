import { z } from "zod";

/*
  Mirrors UserLogin in app/schemas/user_login.py.

  Note what is missing: no length rule on the password. UserLogin declares
  SecretStr with no min_length, and that is correct — an account created
  before the rules tightened must still be able to sign in. Enforcing the
  create-time minimum here would lock those accounts out of their own
  dashboard while the server was perfectly willing to let them in.
*/
export const userLoginSchema = z.object({
  email: z
    .email("Enter a valid email address.")
    .trim()
    .max(254, "Email address cannot be longer than 254 characters."),
  password: z.string().min(1, "Password is required."),
});
