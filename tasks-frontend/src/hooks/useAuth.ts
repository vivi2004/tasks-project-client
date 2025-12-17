import { useCallback, useEffect, useState } from "react";
import { loginApi, registerApi, getMeApi, logoutApi } from "../api/auth.api";
import { useUserStore } from "../store/user.store";

export const useAuth = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.logout);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Called once on app load (supports Google OAuth)
  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMeApi();
      setUser(data);
    } catch {
      clearUser();
    } finally {
      setLoading(false);
    }
  }, [setUser, clearUser]);

  // ❌ Register should NOT log user in
  const register = useCallback(
    async (payload: any) => {
      try {
        setLoading(true);
        setError(null);
        await registerApi(payload);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Registration failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ✅ Login sets cookie, then fetch user
  const login = useCallback(
    async (payload: any) => {
      try {
        setLoading(true);
        setError(null);
        await loginApi(payload);
        await initAuth();
      } catch (err: any) {
        setError(err?.response?.data?.message || "Login failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [initAuth]
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      clearUser();
    }
  }, [clearUser]);

  return {
    user,
    loading,
    error,
    initAuth,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};