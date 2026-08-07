import Card from "../../ui/Card.jsx";
import Avatar from "../../ui/Avatar.jsx";
import StaffInfo from "./StaffInfo.jsx";
import StaffActions from "./StaffActions.jsx";

/*
  One staff row, for doctors and receptionists alike: specialty is simply
  absent for the latter.

  Presentation only. It receives plain strings and callbacks and knows
  nothing about the API's field names. 'selected' is a prop rather than
  local state because only one row may be selected and no row can know
  what the others are doing.
*/
function StaffCard({
  initials,
  name,
  specialty,
  role,
  email,
  selected = false,
  onSelect,
  onEdit,
  onDeactivate,
}) {
  return (
    // Clicks on the action buttons bubble up and select the row too, which
    // is intended: acting on a row is a stronger "this one" than clicking it.
    <Card
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`cursor-pointer p-4 shadow-[0_12px_30px_var(--plum-17)] transition duration-200 sm:p-5 ${
        selected
          ? "animate-selected-pulse border-coral bg-warm-blush outline-3 outline-transparent"
          : "bg-porcelain/92 hover:border-violet/40"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar initials={initials} className="bg-seafoam/60" />
          <StaffInfo
            name={name}
            specialty={specialty}
            role={role}
            email={email}
          />
        </div>

        <StaffActions
          name={name}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
        />
      </div>
    </Card>
  );
}

export default StaffCard;
