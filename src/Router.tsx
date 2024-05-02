import { createBrowserRouter } from "react-router-dom";
import { Homepage, Landingpage } from "./pages";


const Router = createBrowserRouter([
  {
    path: '/',
    element: <Landingpage />
  },

  {
    path: "HiveHub",
    element: <Homepage />,
  },
 
]);

export default Router;