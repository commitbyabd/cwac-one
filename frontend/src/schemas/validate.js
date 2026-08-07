/*
  Runs a Zod schema against a form's values and returns something a form
  can use directly.

  Zod reports every problem it finds, and reports them as a flat list of
  issues carrying a path. A form needs the opposite shape — one message per
  field, keyed by field name — so this flattens the list and keeps the first
  message per field, since each input shows a single line beneath it.

  The parsed data comes back too, and it is the thing worth sending: Zod
  applies the schema's transforms (trimming, mostly) and drops any key the
  schema does not declare. So a receptionist payload loses 'specialization'
  and an edit payload loses 'password' without anyone writing that by hand.
*/
export function validateWith(schema, values) {
  const result = schema.safeParse(values);

  if (result.success) {
    return { valid: true, data: result.data, errors: {} };
  }

  const errors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field && !errors[field]) errors[field] = issue.message;
  }

  return { valid: false, data: null, errors };
}

/*
  Checks one field of an object schema, for validating as the user leaves an
  input rather than waiting for submit.

  z.object exposes its fields on .shape, so the field's own schema can be
  pulled out and parsed alone. A name the schema does not declare returns no
  message — that is not a failure, it just means the schema has no opinion
  about that input, the way the update schemas have none about 'password'.

  Returns the message, or an empty string when the field is fine.
*/
export function validateField(schema, name, value) {
  const fieldSchema = schema.shape?.[name];
  if (!fieldSchema) return "";

  const result = fieldSchema.safeParse(value);
  return result.success ? "" : result.error.issues[0].message;
}
