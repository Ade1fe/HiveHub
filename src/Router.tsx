import { createBrowserRouter } from "react-router-dom";
import { Homepage, LandingPage,  } from "./pages";


const Router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },

  {
    path: "hive-hub",
    element: <Homepage />,
  },
 
]);

export default Router;