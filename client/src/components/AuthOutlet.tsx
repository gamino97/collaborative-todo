import { Outlet } from "react-router-dom";
import Fallback from "components/Fallback";
import { useUser } from "services/user";

export const AuthOutlet = () => {
  const { isLoading, error } = useUser();
  if (isLoading) return <Fallback />;
  if (error instanceof Error) return <span>Error: {error.message}</span>;
  return (
    <>
      <Outlet />
    </>
  );
};
