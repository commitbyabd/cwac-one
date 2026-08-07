import { useState } from "react";
import { Mail, User, Stethoscope } from "lucide-react";
import Modal from "../../ui/Modal.jsx";
import Button from "../../ui/Button.jsx";
import Alert from "../../ui/Alert.jsx";
import TextField from "../../ui/TextField.jsx";
import IconBox from "../../ui/IconBox.jsx";
import PasswordField from "../sign-up/PasswordField.jsx";
import {
  createDoctor,
  createReceptionist,
  updateDoctor,
  updateReceptionist,
} from "../../../api/admin.js";
import { readApiError } from "../../../api/auth.js";
import {
  doctorCreateSchema,
  doctorUpdateSchema,
  receptionistCreateSchema,
  receptionistUpdateSchema,
} from "../../../schemas/staff.js";
import { validateWith } from "../../../schemas/validate.js";

/*
  One dialog for adding and editing staff.

  Two axes, four combinations, no duplication:
    - 'kind'  decides doctor or receptionist — which endpoint is called and
      whether specialization is asked for.
    - 'staff' decides add or edit — pass a record to edit it, pass nothing
      to create a new one.

  The rules live in src/schemas/staff.js, which mirrors the Pydantic models.
  They are checked here only to spare the user a round trip; the server still
  validates, and a rejection surfaces through readApiError.
*/
const SCHEMAS = {
  doctor: { create: doctorCreateSchema, update: doctorUpdateSchema },
  receptionist: {
    create: receptionistCreateSchema,
    update: receptionistUpdateSchema,
  },
};

function StaffFormModal({ staff = null, kind, onClose, onSaved }) {
  const isDoctor = kind === "doctor";
  const isCreate = staff === null;
  const noun = isDoctor ? "doctor" : "receptionist";
  const mode = isCreate ? "add" : "edit";

  const [values, setValues] = useState({
    full_name: staff?.full_name ?? "",
    email: staff?.email ?? "",
    specialization: staff?.specialization ?? "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const schema = SCHEMAS[isDoctor ? "doctor" : "receptionist"][
      isCreate ? "create" : "update"
    ];

    /*
      The parsed data is the payload. The schema has already trimmed what
      should be trimmed and dropped every key it does not declare — so a
      receptionist loses 'specialization' and an edit loses 'password'
      without this function knowing either rule.
    */
    const { valid, data: payload, errors } = validateWith(schema, values);
    setFieldErrors(errors);
    if (!valid) return;

    setSaving(true);
    try {
      let envelope;

      if (isCreate) {
        envelope = isDoctor
          ? await createDoctor(payload)
          : await createReceptionist(payload);
      } else {
        envelope = isDoctor
          ? await updateDoctor(staff.id, payload)
          : await updateReceptionist(staff.id, payload);
      }

      /*
        The parent refetches; it owns the list, not this dialog. The payload
        goes back with the message because the name in it is the new one —
        the parent's copy of the record still holds the name before the edit.
      */
      onSaved(envelope.message, payload);
    } catch (error) {
      // A duplicate email lands here as a 409 with a readable message.
      setFormError(readApiError(error));
      setSaving(false);
    }
  };

  return (
    <Modal
      title={`${isCreate ? "Add" : "Edit"} ${noun}`}
      subtitle={
        isCreate
          ? "They can sign in with these details straight away."
          : staff.full_name
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        {formError && <Alert className="mb-5">{formError}</Alert>}

        <div className="space-y-5">
          <TextField
            id={`${mode}-full-name`}
            name="full_name"
            label="Full name"
            placeholder={isDoctor ? "Dr. Sara Khan" : "Sara Khan"}
            value={values.full_name}
            onChange={handleChange}
            error={fieldErrors.full_name}
            disabled={saving}
            icon={
              <IconBox className="bg-lavender">
                <User className="size-4 text-violet" strokeWidth={2} />
              </IconBox>
            }
          />

          <TextField
            id={`${mode}-email`}
            name="email"
            type="email"
            label="Email address"
            placeholder="name@clinic.com"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            error={fieldErrors.email}
            disabled={saving}
            icon={
              <IconBox className="bg-lavender">
                <Mail className="size-4 text-violet" strokeWidth={2} />
              </IconBox>
            }
          />

          {isDoctor && (
            <TextField
              id={`${mode}-specialization`}
              name="specialization"
              label="Specialization"
              placeholder="Dermatology"
              value={values.specialization}
              onChange={handleChange}
              error={fieldErrors.specialization}
              disabled={saving}
              icon={
                <IconBox className="bg-lavender">
                  <Stethoscope className="size-4 text-violet" strokeWidth={2} />
                </IconBox>
              }
            />
          )}

          {isCreate && (
            <PasswordField
              id={`${mode}-password`}
              label="Temporary password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              error={fieldErrors.password}
              disabled={saving}
            />
          )}
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="disabled:pointer-events-none disabled:opacity-70"
          >
            {isCreate
              ? saving
                ? "Adding…"
                : `Add ${noun}`
              : saving
                ? "Saving…"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default StaffFormModal;
