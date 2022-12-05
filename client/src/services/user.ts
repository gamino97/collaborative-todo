import apiClient from "lib/apiClient";
import { useQuery } from "@tanstack/react-query";

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
  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  const user = query.data;
  const isLoggedIn = Boolean(user?.email);
  return { ...query, isLoggedIn };
}

export { useUser };
