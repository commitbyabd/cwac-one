import SignupHeading from "./SignupHeading.jsx";
import LoginForm from "./LoginForm.jsx";
import SecurityNote from "./SecurityNote.jsx";

/*
  Layout only.
  Every visual piece lives in its own file — this component just
  arranges them and owns the spacing between them.

  Vertical rhythm (per spec):
    heading → description 8px  (inside SignupHeading)
    description → form   32px  (mt-8)
    field → field        22px  (inside LoginForm)
    password → button    20px  (inside LoginForm)
    button → security    28px  (mt-7)
*/
function SignupMain() {
  return (
    <main className="grid min-h-screen place-items-center bg-(image:--gradient-page) px-4 py-10 sm:px-6">
      <section className="w-full max-w-(--login-card-width) rounded-xl border border-white/75 bg-porcelain/88 p-6 shadow-card backdrop-blur-card sm:p-10">
        <SignupHeading />

        <div className="mt-8">
          <LoginForm />
        </div>

        <div className="mt-7">
          <SecurityNote />
        </div>
      </section>
    </main>
  );
}

export default SignupMain;
