import { Stethoscope, ConciergeBell, UserX } from "lucide-react";
import Card from "../../ui/Card.jsx";
import NavItem from "../../ui/NavItem.jsx";

const ITEMS = [
  {
    icon: Stethoscope,
    title: "Doctors",
    subtitle: "Clinicians taking appointments",
  },
  {
    icon: ConciergeBell,
    title: "Receptionists",
    subtitle: "Front desk and scheduling",
  },
  {
    icon: UserX,
    title: "Deactivated users",
    subtitle: "Accounts without access",
  },
];

/*
  The sidebar is a controlled component: it renders whichever item the
  parent says is active and reports clicks back, rather than tracking a
  selection the list would then have to stay in sync with.
*/
function ManagePanel({ activeTitle = "Doctors", onSelect }) {
  return (
    <Card
      as="nav"
      aria-label="Manage staff"
      className="bg-porcelain/85 p-4 shadow-[0_12px_30px_var(--plum-17)] sm:p-5"
    >
      <p className="px-3 font-primary text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        Manage staff
      </p>

      <div className="mt-4 space-y-1">
        {ITEMS.map((item) => (
          <NavItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            active={item.title === activeTitle}
            onClick={() => onSelect?.(item.title)}
          />
        ))}
      </div>
    </Card>
  );
}

export default ManagePanel;
