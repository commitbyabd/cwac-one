import { Mail } from "lucide-react";
import TextField from "../../ui/TextField.jsx";
import IconBox from "../../ui/IconBox.jsx";

function EmailField({ error }) {
  return (
    <TextField
      id="email"
      name="email"
      type="email"
      label="Email address"
      placeholder="you@clinic.com"
      autoComplete="email"
      error={error}
      icon={
        <IconBox className="bg-lavender">
          <Mail className="size-4 text-violet" strokeWidth={2} />
        </IconBox>
      }
    />
  );
}

export default EmailField;
