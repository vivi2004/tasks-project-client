import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { initAuth, loading } = useAuth();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (loading) {
    return null; // you can replace this with a spinner later
  }

  return <RouterProvider router={router} />;
}

export default App;
