import { useEffect } from "react";
import { X } from "lucide-react";
import Card from "./Card.jsx";

// Dialog shell. Owns the backdrop, Escape to close and the scroll lock;
// the caller supplies the body and the footer.
function Modal({ title, subtitle, onClose, children, width = "max-w-[520px]" }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Sibling of the panel, not its parent, so a click inside the dialog
          never bubbles out and closes it */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-plum/45 backdrop-blur-glass"
      />

      <Card
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${width} bg-porcelain/95 p-6 shadow-card backdrop-blur-card sm:p-7`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-primary text-heading-xs leading-heading font-semibold tracking-tight text-plum">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 font-primary text-sm leading-body text-muted">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-9 shrink-0 place-items-center rounded-md text-muted transition duration-200 hover:bg-pale-lavender hover:text-plum focus-visible:ring-2 focus-visible:ring-violet/22 focus-visible:outline-none"
          >
            <X className="size-4.5" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </Card>
    </div>
  );
}

export default Modal;
