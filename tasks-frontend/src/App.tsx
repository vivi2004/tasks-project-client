import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useUserStore } from "./store/user.store";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Loader from "./components/common/Loader";



function App() {
  const loadUser = useUserStore((state) => state.loadUser);
  const isLoading = useUserStore((state) => state.isLoading);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Load user once on mount
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array - loadUser is stable from Zustand store

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider user={user}>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
