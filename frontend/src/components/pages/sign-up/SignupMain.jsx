import StaffBadge from "./StaffBadge.jsx";
import SignupHeading from "./SignupHeading.jsx";
import EmailField from "./EmailField.jsx";
import PasswordField from "./PasswordField.jsx";
import SecurityNote from "./SecurityNote.jsx";
import Button from "../../ui/Button.jsx";
import IconBox from "../../ui/IconBox.jsx";
import { ArrowRight } from "lucide-react";

/*
  Layout only.
  Every visual piece lives in its own file — this component just
  arranges them and owns the spacing between them.

  Vertical rhythm (per spec):
    badge → heading      24px  (mt-6)
    heading → description 8px  (inside SignupHeading)
    description → form   32px  (mt-8)
    field → field        22px  (space-y)
    password → button    20px  (mt-5)
    button → security    28px  (mt-7)
*/
function SignupMain() {
  return (
    <main className="grid min-h-screen place-items-center bg-(image:--gradient-page) px-4 py-10 sm:px-6">
      <section className="w-full max-w-(--login-card-width) rounded-xl border border-white/75 bg-porcelain/88 p-6 shadow-card backdrop-blur-card sm:p-10">
        <StaffBadge />

        <div className="mt-6">
          <SignupHeading />
        </div>

        <form className="mt-8" onSubmit={(event) => event.preventDefault()}>
          <div className="space-y-5.5">
            <EmailField />
            <PasswordField />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-5"
            trailingIcon={
              <IconBox size="size-[34px]" className="bg-white/15">
                <ArrowRight className="size-4.5 text-white" strokeWidth={2.25} />
              </IconBox>
            }
          >
            Enter workspace
          </Button>
        </form>

        <div className="mt-7">
          <SecurityNote />
        </div>
      </section>
    </main>
  );
}

export default SignupMain;
