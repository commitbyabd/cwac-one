import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

/*
  Transient success message. It appears, announces itself, and leaves on
  its own — there is nothing to dismiss, because it never blocks anything.

  Deliberately stateless: the parent decides whether a toast exists, and
  this component only says when it is finished. Give it a React key that
  changes per message, so a second toast remounts and restarts the clock
  instead of inheriting whatever was left of the first one's.
*/
function Toast({ message, duration = 2000, onDone }) {
  /*
    onDone is kept in a ref so the timer below depends only on 'duration'.
    Parents usually pass an inline arrow, which is a new function on every
    render — as a dependency it would restart the countdown each time the
    dashboard re-rendered, and the toast could hang around indefinitely.
  */
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-6 z-60 flex justify-center px-4"
    >
      <div className="flex items-center gap-3 rounded-pill bg-plum px-5 py-3 font-primary text-sm font-medium text-white shadow-card">
        <span className="grid size-5 shrink-0 place-items-center rounded-pill bg-seafoam">
          <Check className="size-3.5 text-plum" strokeWidth={3} />
        </span>
        {message}
      </div>
    </div>
  );
}

export default Toast;
