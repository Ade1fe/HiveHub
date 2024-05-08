import { createBrowserRouter } from "react-router-dom";
import { Homepage, LandingPage,  } from "./pages";


const Router = createBrowserRouter([
  {
    path: '/',
    element: <Landingpage />
  },

  {
    path: "hive-hub",
    element: <Homepage />,
  },
  {
    path: "display/:id",
    element: <DisplayPage />,
  },
  {
    path: "admin",
    element: <WritePage />,
  },
]);

export default Router;