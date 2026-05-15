import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

import { Navigate } from "react-router-dom";

export function DashboardIndexRedirect() {
  const role = useSelector((state: RootState) => state.auth.user?.role ?? "");

  if (role === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (role === "employer") {
    return <Navigate to="/dashboard/employer" replace />;
  }

  if (role === "candidate") {
    return <Navigate to="/dashboard/candidate" replace />;
  }

  return <Navigate to="/complete-profile" replace />;
}
