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
import { JobDetails } from "./components/JobDetails";
import ApplicationView from "./components/ApplicationView";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminJobListings from "./screens/admin/AdminJobListings";
import AdminEmployers from "./screens/admin/AdminEmployers";
import AdminCandidates from "./screens/admin/AdminCandidates";
import { NewJobList } from "./components/NewJobList";
import { DashboardIndexRedirect } from "./components/DashboardIndexRedirect";
import EmployerJobListings from "./screens/employer/EmployerJobListings";
import EmployerApplications from "./screens/employer/EmployerApplications";
import EmployerProfile from "./screens/employer/EmployerProfile";
import CandidateApplications from "./screens/candidate/CandidateApplications";
import CandidateProfile from "./screens/candidate/CandidateProfile";

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
          {
            path: "job-listings/:jobId",
            element: <JobDetails />,
          },
          {
            path: "application/:appId",
            element: <ApplicationView />,
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
    path: "dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <DashboardIndexRedirect /> },
      {
        path: "admin",
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "job-listings", element: <AdminJobListings /> },
          { path: "job-listings/pending", element: <AdminJobListings /> },
          { path: "candidates", element: <AdminCandidates /> },
          { path: "employers", element: <AdminEmployers /> },
        ],
      },
      {
        path: "employer",
        children: [
          { index: true, element: <h1>Employer Dashboard</h1> },
          { path: "job-listings", element: <EmployerJobListings /> },
          { path: "job-listings/new", element: <NewJobList /> },
          { path: "candidates", element: <h1>Candidate Profiles</h1> },
          { path: "applications", element: <EmployerApplications /> },
          { path: "profile", element: <EmployerProfile /> },
        ],
      },
      {
        path: "candidate",
        children: [
          { index: true, element: <h1>Candidate Dashboard</h1> },
          { path: "job-listings", element: <JobListingsPage /> },
          { path: "applications", element: <CandidateApplications /> },
          { path: "profile", element: <CandidateProfile /> },
        ],
      },
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
