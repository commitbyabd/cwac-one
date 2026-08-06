/*
  Generic primary button — gradient surface, left-aligned label,
  optional icon parked in a translucent square on the right.
  Reuse this everywhere; do not re-style buttons per page.
*/
function Button({
  children,
  trailingIcon,
  type = "button",
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`flex h-(--button-height) w-full items-center justify-between rounded-md bg-(image:--gradient-primary-button) px-5 font-primary text-md-lg font-semibold text-white shadow-button transition duration-200 hover:-translate-y-px hover:filter-(--filter-button-hover) focus-visible:ring-4 focus-visible:ring-violet/22 focus-visible:outline-none ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {trailingIcon && (
        <span className="grid size-[34px] shrink-0 place-items-center rounded-sm bg-white/15">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}

export default Button;
