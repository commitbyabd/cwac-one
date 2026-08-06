import { Pencil, Ban } from "lucide-react";
import Button from "../../ui/Button.jsx";

/*
  The per-row actions. Both buttons only open a dialog — the request itself
  belongs to whoever owns the list, since that is what has to refresh
  afterwards.
*/
function DoctorActions({ name, onEdit, onDeactivate }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        aria-label={`Edit ${name}`}
        leadingIcon={<Pencil className="size-4" strokeWidth={2} />}
      >
        Edit
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={onDeactivate}
        aria-label={`Deactivate ${name}`}
        leadingIcon={<Ban className="size-4" strokeWidth={2} />}
      >
        Deactivate
      </Button>
    </div>
  );
}

export default DoctorActions;
