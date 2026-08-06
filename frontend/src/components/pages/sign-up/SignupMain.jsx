/*
  The real signup screen — build the form here.
  Placeholder markup below is only a smoke test that routing and the
  Aurora Reception tokens are both live. Replace it freely.

  Note the shorthand for :root variables that have no utility class:
  bg-(image:--gradient-page) is Tailwind 4's canonical form of
  bg-[image:var(--gradient-page)]. Both compile the same.
*/
function SignupMain() {
  return (
    <main className="grid min-h-screen place-items-center bg-(image:--gradient-page)">
      <section className="w-(--login-card-width) rounded-xl bg-porcelain p-(--padding-card) shadow-card">
        <h1 className="font-primary text-heading-lg leading-heading font-bold tracking-tight text-plum">
          Create your account
        </h1>
        <p className="font-primary text-md leading-body mt-2 text-muted">
          SignupMain is mounted. Routing works — start the form here.
        </p>
      </section>
    </main>
  );
}

export default SignupMain;
