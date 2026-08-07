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
