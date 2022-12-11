import { Outlet, useNavigate } from "react-router-dom";
import Fallback from "components/Fallback";
import { useUser } from "services/user";
import { useEffect } from "react";

export const AuthOutlet = () => {
  const { isLoading, error, isLoggedIn } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate("/login");
  }, [isLoading, isLoggedIn]);

  if (isLoading) return <Fallback />;
  if (error instanceof Error) return <span>Error: {error.message}</span>;

  return (
    <>
      <Outlet />
    </>
  );
};
