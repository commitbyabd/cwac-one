import DashboardMain from "../../components/pages/dashboard/DashboardMain.jsx";

/*
  Page layer — thin by design.
  Route guards and data loading belong here later; the UI lives
  in DashboardMain.
*/
function Dashboard() {
  return <DashboardMain />;
}

export default Dashboard;
