import { Pencil, Ban } from "lucide-react";
import Button from "../../ui/Button.jsx";

function DoctorActions({ name }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        aria-label={`Edit ${name}`}
        leadingIcon={<Pencil className="size-4" strokeWidth={2} />}
      >
        Edit
      </Button>

      <Button
        variant="danger"
        size="sm"
        aria-label={`Deactivate ${name}`}
        leadingIcon={<Ban className="size-4" strokeWidth={2} />}
      >
        Deactivate
      </Button>
    </div>
  );
}

export default DoctorActions;
