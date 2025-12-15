import { useCallback } from "react";
import { loginApi, registerApi } from "../api/auth.api";
import { useUserStore } from "../store/user.store";

export const useAuth = () => {
  // Use selectors to only subscribe to the specific actions we need
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);
  const loadUser = useUserStore((state) => state.loadUser);

  const login = useCallback(async (payload: any) => {
    const data = await loginApi(payload);
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
  }, [setUser]);

  const register = useCallback(async (payload: any) => {
    const data = await registerApi(payload);
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
  }, [setUser]);

  return {
    login,
    register,
    loadUser,
    logout,
  };
};