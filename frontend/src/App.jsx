import { BrowserRouter } from "react-router-dom";
import ProjectRoutes from "./routes/ProjectRoutes.jsx";

/*
  App is the composition root.
  Its only job is to mount the router — every screen is chosen
  inside ProjectRoutes, never here.
*/
function App() {
  return (
    <BrowserRouter>
      <ProjectRoutes />
    </BrowserRouter>
  );
}

export default App;
