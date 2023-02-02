import apiClient from "lib/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  active: boolean;
  created_at: string;
  updated_at: null | string;
  uuid: string;
  name: string;
  email: string;
}

async function fetchUser(): Promise<User> {
  const response = await apiClient.get("/auth/user");
  return response.data;
}

function useUser() {
  const queryClient = useQueryClient();
  const invalidateUserQuery = () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };
  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
  });
  const user = query.data;
  const isLoggedIn = Boolean(user?.email);
  const setUser = (data: User) => {
    queryClient.setQueryData(["user"], { ...data });
  };
  return { ...query, isLoggedIn, invalidateUserQuery, setUser };
}

async function requestResetPassword({
  email,
}: {
  email: string;
}): Promise<{ message: string }> {
  const response = await apiClient.post("/auth/reset-password", { email });
  return response.data;
}

interface ValidateResetPasswordTokenParams {
  token: string | undefined;
}
async function validateResetPasswordToken({
  token,
}: ValidateResetPasswordTokenParams): Promise<{ valid: string | boolean }> {
  const response = await apiClient.get(`/auth/reset-password-token/${token}`);
  return response.data;
}

function useResetPasswordToken({ token }: { token: string | undefined }) {
  const query = useQuery({
    queryKey: ["validate", "password", "token", token],
    queryFn: () => validateResetPasswordToken({ token }),
    enabled: !!token,
  });
  return query;
}

interface ResetPasswordParams {
  newPassword: string;
  token: string;
}

interface ResetPasswordResponse {
  message: string;
}

async function resetPassword({
  newPassword,
  token,
}: ResetPasswordParams): Promise<ResetPasswordResponse> {
  const response = await apiClient.post(`/auth/reset-password-token/${token}`, {
    new_password: newPassword,
  });
  return response.data;
}

export interface LoginData {
  email: string;
  password: string;
  remember_me: string;
}

export interface LoginResponse {
  message?: string;
  non_field_errors?: string[];
}

export async function loginUser(data: LoginData): Promise<User> {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
}

export {
  useUser,
  requestResetPassword,
  validateResetPasswordToken,
  useResetPasswordToken,
  resetPassword,
};
