import type { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const IsCompleted = () => {
  const { isAuthenticated, token: stateToken, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const token = stateToken ?? localStorage.getItem("job_board_token");

  if (!isAuthenticated && !token) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user details are missing, keep user on completion flow until profile is completed.
  if (!user || !user.completed_profile) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
};

export default IsCompleted;
