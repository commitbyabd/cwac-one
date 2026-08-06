/*
  Generic rounded surface. The caller supplies background, padding
  and shadow so one Card can serve panels, list rows and headers.
*/
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
