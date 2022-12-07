import apiClient from "lib/apiClient";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface RegisterSuccessResponse {
  message: string;
  user: string;
}

export async function registerUser(
  data: RegisterData
): Promise<RegisterSuccessResponse> {
  const res = await apiClient.post("/auth/register", { ...data });
  return res.data;
}
