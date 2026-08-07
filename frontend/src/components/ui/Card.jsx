// Rounded surface. Background, padding and shadow come from the caller so
// one Card serves panels, list rows and dialogs.
function Card({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag
      className={`rounded-xl border border-border backdrop-blur-glass ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Card;
