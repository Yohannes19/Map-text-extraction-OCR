import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet
} from "react-router-dom";
import Comaprsion from "./routes/Comparsion";
import Home from "./routes/Home";
import Reports from "./routes/Reports";
import Navbar from "./components/Navbar";
import Messages from "./routes/Messages";
import Footer from "./components/Footer";


const AppLayout = () => (
    <>
      <Navbar />
      <Outlet />
      <Footer/>
     
    </>
  );

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "comparsion",
          element: <Comaprsion />,
        },
        {
          path: "reports",
          element: <Reports />,
        },
        {
          path: "messages",
          element: <Messages />,
        },
      ],
    },
  ]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);