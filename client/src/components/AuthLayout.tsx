import { Flex, Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
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
