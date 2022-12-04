import apiClient from "lib/apiClient";
import { useQuery } from "@tanstack/react-query";

interface User {
  username: string;
}
// interface User {
//   id: string;
//   uuid: string;
//   name: string;
//   email: string;
// }
async function fetchUser(): Promise<User> {
  const response = await apiClient.get("/user");
  return response.data;
}
function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
}

export { useUser };
