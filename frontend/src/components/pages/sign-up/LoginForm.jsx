import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EmailField from "./EmailField.jsx";
import PasswordField from "../../ui/PasswordField.jsx";
import Button from "../../ui/Button.jsx";
import IconBox from "../../ui/IconBox.jsx";
import Alert from "../../ui/Alert.jsx";
import { login, saveToken, saveUser, readApiError } from "../../../api/auth.js";
import { userLoginSchema } from "../../../schemas/auth.js";
import { validateField, validateWith } from "../../../schemas/validate.js";

// Owns the form state and the sign-in call; SignupMain stays layout only.
function LoginForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Calm guidance while typing, red once a sign-in attempt has failed.
  const [submitted, setSubmitted] = useState(false);
  const tone = submitted ? "error" : "hint";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setFieldErrors((current) => ({
      ...current,
      [name]: validateField(userLoginSchema, name, value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSubmitted(true);

    const {
      valid,
      data: credentials,
      errors,
    } = validateWith(userLoginSchema, values);

    setFieldErrors(errors);
    if (!valid) return;

    setSubmitting(true);
    try {
      const data = await login(credentials);
      const token = data?.access_token ?? data?.token;
      if (token) saveToken(token);

      // Name and role are only sent here, so cache them for the header.
      saveUser({ full_name: data?.full_name ?? "", role: data?.role ?? "" });

      navigate("/dashboard");
    } catch (error) {
      setFormError(readApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <Alert className="mb-5">{formError}</Alert>}

      <div className="space-y-5.5">
        <EmailField
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={fieldErrors.email}
          tone={tone}
          disabled={submitting}
        />
        <PasswordField
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={fieldErrors.password}
          tone={tone}
          disabled={submitting}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={submitting}
        className="mt-5 disabled:pointer-events-none disabled:opacity-70"
        trailingIcon={
          <IconBox size="size-[34px]" className="bg-white/15">
            <ArrowRight className="size-4.5 text-white" strokeWidth={2.25} />
          </IconBox>
        }
      >
        {submitting ? "Signing in…" : "Enter workspace"}
      </Button>
    </form>
  );
}

export default LoginForm;
