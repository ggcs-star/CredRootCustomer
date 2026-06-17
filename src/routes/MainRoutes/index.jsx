import React from "react";
import { useRoutes } from "react-router-dom";

import Home from "./Home";
import Signup from "../../container/Auth/Signup";
import Login from "../../container/Auth/Login";
import Profile from "../../container/Profile";

import ProtectedRoute from "./ProtectedRoute";

export default function MainRoutes(props) {
  const routes = useRoutes([
    {
      path: "",
      element: <Home {...props} />,
    },
    {
      path: "/login",
      element: <Login {...props} />,
    },
    {
      path: "/signup",
      element: <Signup {...props} />,
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
  ]);

  return <div>{routes}</div>;
}