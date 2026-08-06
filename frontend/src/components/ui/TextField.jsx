/*
  Generic labelled input.
  - icon      → node pinned inside the left edge
  - trailing  → node pinned inside the right edge (e.g. a toggle button)
  - error     → inline validation text rendered beneath the field

  The ring is driven by has-[input:focus] rather than focus-within so a
  focused trailing button lights up on its own, not the whole field.
*/
function TextField({ id, label, icon, trailing, error, className = "", ...inputProps }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block font-primary text-sm font-semibold text-plum"
      >
        {label}
      </label>

      <div className="relative mt-2 flex h-(--input-height) items-center rounded-md border border-border bg-input-surface transition duration-200 has-[input:focus]:border-violet has-[input:focus]:shadow-input-focus">
        {icon && <span className="absolute left-3 flex">{icon}</span>}

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-full w-full rounded-md bg-transparent font-primary text-md text-ink outline-none placeholder:text-muted/60 ${icon ? "pl-14" : "pl-4"} ${trailing ? "pr-14" : "pr-4"}`}
          {...inputProps}
        />

        {trailing && <span className="absolute right-2 flex">{trailing}</span>}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-2 font-primary text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextField;
