import apiClient from "lib/apiClient";

export interface LoginData {
  email: string;
  password: string;
  remember_me: string;
}

export interface LoginResponse {
  message?: string;
  non_field_errors?: string[];
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
}
