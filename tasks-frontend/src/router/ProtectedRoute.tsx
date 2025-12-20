import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/user.store";
import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);
  const hasAttemptedLoad = useUserStore((state) => state.hasAttemptedLoad);

  // While auth status is being resolved
  if (isLoading || !hasAttemptedLoad) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
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
