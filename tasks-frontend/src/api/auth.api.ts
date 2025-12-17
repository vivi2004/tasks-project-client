import axiosInstance from "./axiosInstance";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "../types/auth.types";

/**
 * Login user
 */
export const loginApi = async (payload: LoginPayload) => {
  const { data } = await axiosInstance.post<AuthResponse>(
    "/auth/login",
    payload
  );
  return data;
};

/**
 * Register user
 */
export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post<AuthResponse>(
    "/auth/register",
    payload
  );
  return data;
};

/**
 * Get current logged-in user
 */
export const getMeApi = async () => {
  const { data } = await axiosInstance.get<AuthResponse["user"]>(
    "/auth/me"
  );
  return data;
};

/**
 * Logout user (invalidate refresh token on backend)
 */
export const logoutApi = async () => {
  await axiosInstance.post("/auth/logout");
};