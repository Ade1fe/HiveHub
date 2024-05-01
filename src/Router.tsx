import { createBrowserRouter } from "react-router-dom";
import { Homepage, Welcome } from "./pages";


const Router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />
  },

  {
    path: "HiveHub",
    element: <Homepage />,
  },
 
]);

export default Router;