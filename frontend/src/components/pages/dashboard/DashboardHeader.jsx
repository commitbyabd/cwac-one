import ClinicIdentity from "./ClinicIdentity.jsx";
import HeaderUser from "./HeaderUser.jsx";

/*
  Identity on the left, the signed-in user on the right. Adding staff used
  to live here, but the action belongs to whichever list is on screen —
  it now sits in SectionHeader, which knows whether it is showing doctors
  or receptionists.
*/
function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-porcelain/85 shadow-[0_4px_18px_var(--plum-17)] backdrop-blur-glass">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <ClinicIdentity />

        <HeaderUser />
      </div>
    </header>
  );
}

export default DashboardHeader;
