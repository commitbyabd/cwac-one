import SignupMain from "../../components/pages/sign-up/SignupMain.jsx";

/*
  Page layer — deliberately thin.
  It owns the route's identity, not its markup. Page-level concerns
  (page title, guards, data loading) belong here later; the visible
  UI lives in SignupMain.
*/
function Signup() {
  return <SignupMain />;
}

export default Signup;
