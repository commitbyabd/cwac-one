import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EmailField from "./EmailField.jsx";
import PasswordField from "./PasswordField.jsx";
import Button from "../../ui/Button.jsx";
import IconBox from "../../ui/IconBox.jsx";
import Alert from "../../ui/Alert.jsx";
import { login, saveToken, readApiError } from "../../../api/auth.js";

/*
  Owns the form state and the POST /login call.
  SignupMain stays layout-only.
*/
function LoginForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!values.email.trim()) errors.email = "Email address is required.";
    if (!values.password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await login(values);
      const token = data?.access_token ?? data?.token;
      if (token) saveToken(token);
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
          error={fieldErrors.email}
          disabled={submitting}
        />
        <PasswordField
          value={values.password}
          onChange={handleChange}
          error={fieldErrors.password}
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
