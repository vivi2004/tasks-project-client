import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/user.store";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const user = useUserStore((state) => state.user);
  const { loading } = useAuth();

  // While auth status is being resolved (important for Google OAuth)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated → allow access
  return <Outlet />;
};

export default ProtectedRoute;
