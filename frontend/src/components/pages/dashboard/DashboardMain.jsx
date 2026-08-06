import DashboardHeader from "./DashboardHeader.jsx";
import ManagePanel from "./ManagePanel.jsx";
import SectionHeader from "./SectionHeader.jsx";
import DoctorCard from "./DoctorCard.jsx";

/*
  Layout only — every piece lives in its own file.

  The ambient gradient is the login page's --gradient-page dropped to
  low opacity behind the content, so the dashboard reads as calm rather
  than as a landing page.
*/
const DOCTORS = [
  {
    initials: "SK",
    name: "Dr. Sara Khan",
    specialty: "Dermatology",
    role: "Doctor",
    email: "doctor1@cwac.com",
  },
];

function DashboardMain() {
  return (
    <div className="relative min-h-screen bg-porcelain">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-(image:--gradient-page) opacity-40"
      />

      <div className="relative">
        <DashboardHeader />

        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <ManagePanel activeTitle="Doctors" />

          <section className="min-w-0">
            <SectionHeader
              title="Doctors"
              subtitle="Clinicians taking appointments"
              count={`${DOCTORS.length} record${DOCTORS.length === 1 ? "" : "s"}`}
            />

            <div className="mt-5 space-y-4">
              {DOCTORS.map((doctor) => (
                <DoctorCard key={doctor.email} {...doctor} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;
