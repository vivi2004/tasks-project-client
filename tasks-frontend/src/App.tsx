import { useEffect } from "react";
import { useUserStore } from "./store/user.store";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  // Get loadUser directly from store - Zustand actions are stable references
  const loadUser = useUserStore((state) => state.loadUser);

  useEffect(() => {
    // Load user once on mount - empty deps array ensures this runs only once
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array - loadUser is stable from Zustand store

  return <RouterProvider router={router} />;
}

export default App;
