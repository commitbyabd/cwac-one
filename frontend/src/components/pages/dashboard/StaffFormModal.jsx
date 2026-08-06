import { useState } from "react";
import { Mail, User, Stethoscope } from "lucide-react";
import Modal from "../../ui/Modal.jsx";
import Button from "../../ui/Button.jsx";
import Alert from "../../ui/Alert.jsx";
import TextField from "../../ui/TextField.jsx";
import IconBox from "../../ui/IconBox.jsx";
import { updateDoctor, updateReceptionist } from "../../../api/admin.js";
import { readApiError } from "../../../api/auth.js";

/*
  Edit form for one staff member, shown as a dialog.

  Doctors and receptionists differ by exactly one field, so they share this
  component rather than duplicating a form. 'kind' decides whether
  specialization is asked for and which endpoint the save goes to.

  The rules below mirror DoctorUpdate / ReceptionistUpdate on the server —
  checked here only to spare the user a round trip. The server still
  validates, and a rejection surfaces through readApiError.
*/
function StaffFormModal({ staff, kind, onClose, onSaved }) {
  const isDoctor = kind === "doctor";
  const noun = isDoctor ? "doctor" : "receptionist";

  const [values, setValues] = useState({
    full_name: staff.full_name ?? "",
    email: staff.email ?? "",
    specialization: staff.specialization ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const errors = {};

    if (values.full_name.trim().length < 2) {
      errors.full_name = "Full name must be at least 2 characters.";
    }
    if (!values.email.trim()) {
      errors.email = "Email address is required.";
    }
    if (isDoctor && values.specialization.trim().length < 2) {
      errors.specialization = "Specialization must be at least 2 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    const payload = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
    };
    if (isDoctor) payload.specialization = values.specialization.trim();

    setSaving(true);
    try {
      const envelope = isDoctor
        ? await updateDoctor(staff.id, payload)
        : await updateReceptionist(staff.id, payload);

      // The parent refetches; it owns the list, not this dialog.
      onSaved(envelope.message);
    } catch (error) {
      setFormError(readApiError(error));
      setSaving(false);
    }
  };

  return (
    <Modal
      title={`Edit ${noun}`}
      subtitle={staff.full_name}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        {formError && <Alert className="mb-5">{formError}</Alert>}

        <div className="space-y-5">
          <TextField
            id="edit-full-name"
            name="full_name"
            label="Full name"
            placeholder="Dr. Sara Khan"
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
            id="edit-email"
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
              id="edit-specialization"
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
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default StaffFormModal;
