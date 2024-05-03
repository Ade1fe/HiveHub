import { createBrowserRouter } from "react-router-dom";
import { DisplayPage, Homepage, LandingPage, WritePage,  } from "./pages";


const Router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
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