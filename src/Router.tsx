import { createBrowserRouter } from "react-router-dom";
import { Homepage } from "./pages";


const Router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
 
]);

export default Router;