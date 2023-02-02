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
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
  });
  const user = query.data;
  const isLoggedIn = Boolean(user?.email);
  return { ...query, isLoggedIn, invalidateUserQuery };
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
async function resetPassword({
  newPassword,
  token,
}: ResetPasswordParams): Promise<any> {
  const response = await apiClient.post(`/auth/reset-password-token/${token}`, {
    new_password: newPassword,
  });
  return response;
}

export {
  useUser,
  requestResetPassword,
  validateResetPasswordToken,
  useResetPasswordToken,
  resetPassword,
};
