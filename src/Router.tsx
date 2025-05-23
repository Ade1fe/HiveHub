import { createBrowserRouter } from "react-router-dom";
import { DisplayPage, Homepage, LandingPage, WritePage,  } from "./pages";



const Router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },

  {
    path: "/hive-hub",
    element: <Homepage />,
  },
  {
    path: "/display/:postId",
    element: <DisplayPage  />,
  },
  {
    path: "write",
    element: <WritePage />,
  },
]);

export default Router;