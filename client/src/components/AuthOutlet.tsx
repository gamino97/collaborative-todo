import { Outlet } from "react-router-dom";
import Fallback from "components/Fallback";
import { useUser } from "services/user";
import apiClient from "lib/apiClient";

export const AuthOutlet = () => {
  const { isLoading, error } = useUser();
  if (isLoading) return <Fallback />;
  if (error instanceof Error) return <span>Error: {error.message}</span>;
  const handleClick = async () => {
    const x = await apiClient.get("/auth/user");
    console.log({ x });
  };
  return (
    <>
      <Outlet />
      <button onClick={handleClick}>Presiona</button>
    </>
  );
};
