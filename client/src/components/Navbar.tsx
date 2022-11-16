import { Box, Flex, Text, Center } from "@chakra-ui/react";
import Avatar from "react-avatar";

export default function Navbar() {
  return (
    <Box as="nav" bgColor="purple.500" textColor="white" height="50px">
      <Flex
        paddingX="20px"
        height="full"
        width="full"
        justifyContent="space-between"
      >
        <Center>
          <img src="/todo-icon.svg" alt="Todo Icon" width="30" height="30" />
          <Text as="h1" marginX="5px">
            Collaborative Todo List
          </Text>
        </Center>
        <Center>
          <Avatar name="Carlos Gamino" size="30px" round />
          <Text as="h1" marginLeft="5px">
            Carlos Gamino
          </Text>
        </Center>
      </Flex>
    </Box>
  );
}
