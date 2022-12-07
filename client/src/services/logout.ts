import apiClient from "lib/apiClient";

interface LogoutResponse {
  message: string;
}

async function logout(): Promise<LogoutResponse> {
  const res = await apiClient.post("/auth/logout");
  return res.data;
}

export { logout };
