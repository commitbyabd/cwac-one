import { Plus } from "lucide-react";
import ClinicIdentity from "./ClinicIdentity.jsx";
import HeaderUser from "./HeaderUser.jsx";
import Button from "../../ui/Button.jsx";

function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-porcelain/85 shadow-[0_4px_18px_var(--plum-17)] backdrop-blur-glass">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <ClinicIdentity />

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <HeaderUser />
          <Button
            variant="primary"
            leadingIcon={<Plus className="size-4.5" strokeWidth={2.25} />}
          >
            Add User
          </Button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
