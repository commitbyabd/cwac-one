import { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader.jsx";
import ManagePanel from "./ManagePanel.jsx";
import SectionHeader from "./SectionHeader.jsx";
import DoctorCard from "./DoctorCard.jsx";
import StaffFormModal from "./StaffFormModal.jsx";
import ConfirmDialog from "../../ui/ConfirmDialog.jsx";
import Alert from "../../ui/Alert.jsx";
import {
  listDoctors,
  listReceptionists,
  deactivateDoctor,
  deactivateReceptionist,
} from "../../../api/admin.js";
import { readApiError } from "../../../api/auth.js";
import { initialsFrom } from "../../../utils/initials.js";

/*
  Everything the two staff lists differ by, in one place. Adding a third
  kind of staff means adding an entry here, not another branch further
  down the file.
*/
const VIEWS = {
  Doctors: {
    kind: "doctor",
    noun: "doctor",
    subtitle: "Clinicians taking appointments",
    fetchList: listDoctors,
    deactivate: deactivateDoctor,
  },
  Receptionists: {
    kind: "receptionist",
    noun: "receptionist",
    subtitle: "Front desk and scheduling",
    fetchList: listReceptionists,
    deactivate: deactivateReceptionist,
  },
};

function DashboardMain() {
  const [activeTitle, setActiveTitle] = useState("Doctors");
  const view = VIEWS[activeTitle];

  /*
    One piece of state for the whole request, tagged with the view it
    belongs to. Keeping them together means the effect never has to set
    state synchronously to reset the previous tab's data — staleness is
    worked out at render time by comparing 'title' against the active tab.
  */
  const [result, setResult] = useState({
    title: null,
    status: "loading",
    items: [],
    message: "",
  });

  /*
    Bumped after a successful edit or deactivation to re-run the fetch.
    Cheaper to reason about than editing the local array by hand, and it
    guarantees the screen shows what the database actually holds.
  */
  const [reloadToken, setReloadToken] = useState(0);

  const [editing, setEditing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  useEffect(() => {
    // "Deactivated users" has no endpoint yet, so there is nothing to load.
    if (!view) return undefined;

    /*
      StrictMode runs effects twice in development, and switching tabs
      quickly can leave an older request in flight. The flag makes any late
      reply a no-op instead of overwriting the newer list.
    */
    let cancelled = false;

    view
      .fetchList()
      .then((envelope) => {
        if (cancelled) return;
        setResult({
          title: activeTitle,
          status: "ready",
          items: envelope.data ?? [],
          message: "",
        });
      })
      .catch((requestError) => {
        if (cancelled) return;
        // A 401 never reaches here as an error the user sees — the response
        // interceptor in client.js signs them out first.
        setResult({
          title: activeTitle,
          status: "error",
          items: [],
          message: readApiError(requestError),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [view, activeTitle, reloadToken]);

  /*
    Data from a different tab is treated as no data at all. A refetch of the
    same tab keeps the old rows on screen instead of flashing back to
    "Loading…", which would make every save look like a page reload.
  */
  const isCurrent = result.title === activeTitle;
  const status = isCurrent ? result.status : "loading";
  const staff = isCurrent ? result.items : [];

  const refresh = () => setReloadToken((token) => token + 1);

  const closeConfirm = () => {
    setConfirming(null);
    setConfirmError("");
  };

  const handleDeactivate = async () => {
    setConfirmBusy(true);
    setConfirmError("");

    try {
      await view.deactivate(confirming.id);
      setConfirming(null);
      refresh();
    } catch (requestError) {
      // Kept open so the message lands where the user is looking.
      setConfirmError(readApiError(requestError));
    } finally {
      setConfirmBusy(false);
    }
  };

  const count =
    status === "loading"
      ? "Loading…"
      : `${staff.length} record${staff.length === 1 ? "" : "s"}`;

  return (
    <div className="relative min-h-screen bg-porcelain">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-(image:--gradient-page) opacity-40"
      />

      <div className="relative">
        <DashboardHeader />

        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <ManagePanel activeTitle={activeTitle} onSelect={setActiveTitle} />

          <section className="min-w-0">
            <SectionHeader
              title={activeTitle}
              subtitle={view?.subtitle ?? "Accounts without access"}
              count={view ? count : ""}
            />

            <div className="mt-5 space-y-4">
              {!view && (
                <p className="font-primary text-sm leading-body text-muted">
                  Deactivated staff cannot be listed yet — the API endpoint
                  for this view has not been built.
                </p>
              )}

              {view && status === "error" && <Alert>{result.message}</Alert>}

              {view && status === "loading" && (
                <p className="font-primary text-sm text-muted">
                  Loading {view.noun}s…
                </p>
              )}

              {view && status === "ready" && staff.length === 0 && (
                <p className="font-primary text-sm text-muted">
                  No {view.noun}s yet. Add one to get started.
                </p>
              )}

              {/*
                API field names are mapped here rather than inside the card,
                so DoctorCard stays presentation and knows nothing about the
                backend's vocabulary.
              */}
              {view &&
                status === "ready" &&
                staff.map((member) => (
                  <DoctorCard
                    key={member.id}
                    initials={initialsFrom(member.full_name)}
                    name={member.full_name}
                    specialty={member.specialization}
                    role={view.kind === "doctor" ? "Doctor" : "Receptionist"}
                    email={member.email}
                    onEdit={() => setEditing(member)}
                    onDeactivate={() => setConfirming(member)}
                  />
                ))}
            </div>
          </section>
        </div>
      </div>

      {editing && (
        <StaffFormModal
          staff={editing}
          kind={view.kind}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}

      {confirming && (
        <ConfirmDialog
          title={`Deactivate ${view.noun}`}
          message={`Are you sure you want to deactivate ${confirming.full_name}? They lose access immediately, but the record is kept and can be reactivated later.`}
          confirmLabel="Deactivate"
          busy={confirmBusy}
          error={confirmError}
          onConfirm={handleDeactivate}
          onClose={closeConfirm}
        />
      )}
    </div>
  );
}

export default DashboardMain;
