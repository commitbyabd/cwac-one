/*
  'action' is the section's primary button. It is a slot rather than a prop
  pair because the header should not know what the button does — the page
  that owns the list decides that, and passes it in already wired.
*/
function SectionHeader({ title, subtitle, count, action }) {
  return (
    <div className="border-b border-border pb-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-primary text-heading-sm leading-heading font-semibold tracking-tight text-plum">
            {title}
          </h1>
          <p className="mt-1 font-primary text-sm text-muted">{subtitle}</p>
        </div>

        {/* Count and action share the right column, so the button lands
            directly beneath the record count. */}
        <div className="flex flex-col items-end gap-3">
          <p className="font-primary text-xs text-muted">{count}</p>
          {action}
        </div>
      </div>
    </div>
  );
}

export default SectionHeader;
