/*
  Heading block. The max-width on the description is what makes it
  wrap onto two lines instead of running the full panel width.
*/
function SignupHeading() {
  return (
    <div>
      <h1 className="font-primary text-heading-sm leading-heading font-semibold tracking-tight text-plum sm:text-heading">
        Good to see you
      </h1>
      <p className="mt-2 max-w-[36ch] font-primary text-md leading-body text-muted">
        Enter your assigned credentials to open the clinic dashboard.
      </p>
    </div>
  );
}

export default SignupHeading;
