// React Components
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// Pages
import App from "./App.jsx";
import Home from "./Pages/Home/Home.jsx";
import Releases from "./Pages/Releases/Releases.jsx";
import Subscribe from "./Pages/Subscribe/Subscribe.jsx";
// Custom Styles
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "releases",
        element: <Releases />,
      },
      {
        path: "subscribe",
        element: <Subscribe />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
