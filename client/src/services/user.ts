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
  const invalidateUserQuery = () =>{
    queryClient.invalidateQueries({queryKey: ['user']})
  }
  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: Infinity,
  });
  const user = query.data;
  const isLoggedIn = Boolean(user?.email);
  return { ...query, isLoggedIn, invalidateUserQuery };
}

export { useUser };
