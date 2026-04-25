import type { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = () => {
  const { isAuthenticated, token: stateToken } = useSelector(
    (state: RootState) => state.auth,
  );
  const token = stateToken ?? localStorage.getItem("job_board_token");

  if (!isAuthenticated && !token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectRoute;
