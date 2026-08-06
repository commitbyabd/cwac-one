import Card from "../../ui/Card.jsx";
import Avatar from "../../ui/Avatar.jsx";
import DoctorInfo from "./DoctorInfo.jsx";
import DoctorActions from "./DoctorActions.jsx";

/*
  One staff row. Serves doctors and receptionists alike — 'specialty' is
  simply absent for the latter.

  Presentation only: it is handed plain strings and two callbacks, and
  knows nothing about the API's field names.
*/
function DoctorCard({ initials, name, specialty, role, email, onEdit, onDeactivate }) {
  return (
    <Card className="bg-porcelain/92 p-4 shadow-[0_12px_30px_var(--plum-17)] sm:p-5">
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
