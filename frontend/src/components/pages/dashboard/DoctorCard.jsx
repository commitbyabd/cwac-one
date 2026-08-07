import Card from "../../ui/Card.jsx";
import Avatar from "../../ui/Avatar.jsx";
import DoctorInfo from "./DoctorInfo.jsx";
import DoctorActions from "./DoctorActions.jsx";

/*
  One staff row. Serves doctors and receptionists alike — 'specialty' is
  simply absent for the latter.

  Presentation only: it is handed plain strings and callbacks, and knows
  nothing about the API's field names. 'selected' is passed in rather than
  held here, because only one card in the list may be selected at a time
  and no card can know what the others are doing.
*/
function DoctorCard({
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
    /*
      Clicks on Edit and Deactivate bubble up to here and select the card
      too. That is intentional: acting on a card is a stronger statement of
      "this one" than clicking it, so the highlight should follow.
    */
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
          <DoctorInfo
            name={name}
            specialty={specialty}
            role={role}
            email={email}
          />
        </div>

        <DoctorActions
          name={name}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
        />
      </div>
    </Card>
  );
}

export default DoctorCard;
