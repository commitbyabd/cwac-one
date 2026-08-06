function SectionHeader({ title, subtitle, count }) {
  return (
    <div className="border-b border-border pb-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-primary text-heading-sm leading-heading font-semibold tracking-tight text-plum">
            {title}
          </h1>
          <p className="mt-1 font-primary text-sm text-muted">{subtitle}</p>
        </div>
        <p className="font-primary text-xs text-muted">{count}</p>
      </div>
    </div>
  );
}

export default SectionHeader;
