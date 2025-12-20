import { useCallback, useState } from "react";
import { loginApi, registerApi, logoutApi } from "../api/auth.api";
import { useUserStore } from "../store/user.store";

export const useAuth = () => {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.logout);
  const loadUser = useUserStore((state) => state.loadUser);

  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (payload: any) => {
      try {
        setError(null);
        const data = await registerApi(payload);
        // After registration, store tokens and load user
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          await loadUser();
        }
        return data;
      } catch (err: any) {
        setError(err?.response?.data?.message || "Registration failed");
        throw err;
      }
    },
    [loadUser]
  );

  const login = useCallback(
    async (payload: any) => {
      try {
        setError(null);
        const data = await loginApi(payload);
        // After login, store tokens and load user
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          await loadUser();
        }
        return data;
      } catch (err: any) {
        setError(err?.response?.data?.message || "Login failed");
        throw err;
      }
    },
    [loadUser]
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore logout API errors
    } finally {
      clearUser();
    }
  }, [clearUser]);

  return {
    user,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};