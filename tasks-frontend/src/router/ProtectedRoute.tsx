import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserStore } from "../store/user.store";

const ProtectedRoute = () => {
  // Use separate selectors to prevent unnecessary re-renders
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isLoading = useUserStore((state) => state.isLoading);

  const location = useLocation();

  // Prevent redirect flicker while auth state is loading
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

