import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DashboardHeader from "./DashboardHeader.jsx";
import ManagePanel from "./ManagePanel.jsx";
import SectionHeader from "./SectionHeader.jsx";
import StaffCard from "./StaffCard.jsx";
import StaffFormModal from "./StaffFormModal.jsx";
import ConfirmDialog from "../../ui/ConfirmDialog.jsx";
import Alert from "../../ui/Alert.jsx";
import Button from "../../ui/Button.jsx";
import Toast from "../../ui/Toast.jsx";
import {
  listDoctors,
  listReceptionists,
  deactivateDoctor,
  deactivateReceptionist,
} from "../../../api/admin.js";
import { readApiError } from "../../../api/auth.js";
import { initialsFrom } from "../../../utils/initials.js";

// Everything the two staff lists differ by. A third kind of staff means
// another entry here, not another branch further down the file.
const VIEWS = {
  Doctors: {
    kind: "doctor",
    noun: "doctor",
    role: "Doctor",
    subtitle: "Clinicians taking appointments",
    fetchList: listDoctors,
    deactivate: deactivateDoctor,
  },
  Receptionists: {
    kind: "receptionist",
    noun: "receptionist",
    role: "Receptionist",
    subtitle: "Front desk and scheduling",
    fetchList: listReceptionists,
    deactivate: deactivateReceptionist,
  },
};

function DashboardMain() {
  const [activeTitle, setActiveTitle] = useState("Doctors");
  const view = VIEWS[activeTitle];

  // One piece of state for the request, tagged with the view it belongs to.
  // Staleness is worked out at render time by comparing title against the
  // active tab, so the effect never has to reset it synchronously.
  const [result, setResult] = useState({
    title: null,
    status: "loading",
    items: [],
    message: "",
  });

  // Bumped after a successful write to re-run the fetch, so the screen
  // shows what the database holds rather than a locally patched array.
  const [reloadToken, setReloadToken] = useState(0);

  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // The id only exists to key the toast. Two identical messages in a row
  // would otherwise reuse the element and inherit its remaining timer.
  const [toast, setToast] = useState(null);
  const showToast = (message) => setToast({ id: Date.now(), message });

  useEffect(() => {
    // "Deactivated users" has no endpoint yet.
    if (!view) return undefined;

    // StrictMode runs effects twice, and switching tabs quickly can leave
    // an older request in flight.
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
        // A 401 never lands here: the interceptor in client.js signs the
        // user out first.
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

  // Data from another tab counts as no data. A refetch of the same tab
  // keeps its rows on screen instead of flashing back to "Loading".
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

    // Captured before the dialog closes, since confirming is null by the
    // time the toast is shown.
    const target = confirming;

    try {
      await view.deactivate(target.id);
      setConfirming(null);
      showToast(`${target.full_name} was deactivated successfully.`);
      refresh();
    } catch (requestError) {
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
          <ManagePanel
            activeTitle={activeTitle}
            onSelect={(title) => {
              setActiveTitle(title);
              setSelectedId(null);
            }}
          />

          <section className="min-w-0">
            <SectionHeader
              title={activeTitle}
              subtitle={view?.subtitle ?? "Accounts without access"}
              count={view ? count : ""}
              action={
                view && (
                  <Button
                    variant="primary"
                    leadingIcon={<Plus className="size-4.5" strokeWidth={2.25} />}
                    onClick={() => setCreating(true)}
                  >
                    Add {view.noun}
                  </Button>
                )
              }
            />

            <div className="mt-5 space-y-4">
              {!view && (
                <p className="font-primary text-sm leading-body text-muted">
                  Deactivated staff cannot be listed yet. The API endpoint for
                  this view has not been built.
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

              {/* API field names are mapped here so StaffCard stays
                  presentation and never sees the backend's vocabulary */}
              {view &&
                status === "ready" &&
                staff.map((member) => (
                  <StaffCard
                    key={member.id}
                    initials={initialsFrom(member.full_name)}
                    name={member.full_name}
                    specialty={member.specialization}
                    role={view.role}
                    email={member.email}
                    selected={member.id === selectedId}
                    onSelect={() =>
                      setSelectedId((current) =>
                        current === member.id ? null : member.id,
                      )
                    }
                    onEdit={() => setEditing(member)}
                    onDeactivate={() => setConfirming(member)}
                  />
                ))}
            </div>
          </section>
        </div>
      </div>

      {creating && view && (
        <StaffFormModal
          kind={view.kind}
          onClose={() => setCreating(false)}
          onSaved={(message) => {
            setCreating(false);
            showToast(message || `The ${view.noun} was added successfully.`);
            refresh();
          }}
        />
      )}

      {editing && view && (
        <StaffFormModal
          staff={editing}
          kind={view.kind}
          onClose={() => setEditing(null)}
          onSaved={(message, saved) => {
            setEditing(null);
            // The name just typed, not the one the list still holds.
            showToast(`${saved.full_name}'s fields updated successfully.`);
            refresh();
          }}
        />
      )}

      {confirming && view && (
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

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default DashboardMain;
