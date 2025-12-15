import axiosInstance from "./axiosInstance";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "../types/auth.types";

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await axiosInstance.post<AuthResponse>(
    "/auth/login",
    payload
  );
  return data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post<AuthResponse>(
    "/auth/register",
    payload
  );
  return data;
};

export const getMeApi = async () => {
  const { data } = await axiosInstance.get<AuthResponse["user"]>(
    "/auth/me"
  );
  return data;
};