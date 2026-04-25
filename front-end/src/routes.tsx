import { createBrowserRouter, Outlet } from "react-router-dom";
import App from "./App";
import { HomePage } from "./screens/HomePage";
import { JobListingsPage } from "./screens/JobListingsPage";
import { NotFoundPage } from "./screens/NotFoundPage";
import { LoginPage } from "./screens/LoginPage";
import { RegisterPage } from "./screens/RegisterPage";
import { CompleteProfilePage } from "./screens/CompleteProfilePage";
import ProtectedRoute from "./guard/auth"; // Import your guard
import IsCompleted from "./guard/completed";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Anything inside here gets the App layout
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <IsCompleted />, // Protect this route
        children: [
          {
            path: "job-listings",
            element: <JobListingsPage />,
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "complete-profile", element: <CompleteProfilePage /> },
        ],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },

  {
    path: "auth",
    element: <Outlet />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);
