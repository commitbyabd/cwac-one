import { LogOut } from "lucide-react";

function HeaderUser({ name = "Dr. Amina Rafiq" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="font-primary text-sm font-medium text-plum">{name}</p>
        <p className="font-primary text-xs text-muted">Signed in</p>
      </div>

      <button
        type="button"
        aria-label="Sign out"
        className="grid size-10 place-items-center rounded-md text-muted transition duration-200 hover:bg-pale-lavender hover:text-plum focus-visible:ring-2 focus-visible:ring-violet/22 focus-visible:outline-none"
      >
        <LogOut className="size-4.5" strokeWidth={2} />
      </button>
    </div>
  );
}

export default HeaderUser;
