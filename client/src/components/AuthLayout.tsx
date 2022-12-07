import { Flex, Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useEffect } from "react";
import { useUser } from "services/user";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <Flex width="full" align="center" justifyContent="center" height="100vh">
      <Box
        borderWidth={1}
        px={8}
        py={4}
        width="full"
        maxWidth="500px"
        borderRadius={4}
        textAlign="center"
      >
        {children}
      </Box>
    </Flex>
  );
}
