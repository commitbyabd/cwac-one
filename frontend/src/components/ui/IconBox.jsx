/*
  Generic square icon container.
  Pass the surface colour in via className: <IconBox className="bg-lavender">
*/
function IconBox({ size = "size-8", radius = "rounded-sm", className = "", children }) {
  return (
    <span className={`grid shrink-0 place-items-center ${size} ${radius} ${className}`}>
      {children}
    </span>
  );
}

export default IconBox;
