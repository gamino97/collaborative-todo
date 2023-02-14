import apiClient from "lib/apiClient";
import { User } from "services/user";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface RegisterSuccessResponse {
  message: string;
  user: User;
}

export async function registerUser(data: RegisterData): Promise<User> {
  const res = await apiClient.post("/auth/register", { ...data });
  return res.data;
}
