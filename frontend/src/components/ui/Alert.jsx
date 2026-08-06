/*
  Form-level message. role="alert" so screen readers announce it
  the moment it appears.
*/
function Alert({ children, className = "" }) {
  return (
    <p
      role="alert"
      className={`rounded-md bg-error-bg px-4 py-3 font-primary text-sm leading-body text-error ${className}`}
    >
      {children}
    </p>
  );
}

export default Alert;
