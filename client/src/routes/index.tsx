import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Center,
  Box,
  Text,
  Button,
  Heading,
  Flex,
  Link,
} from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";
function Footer() {
  return (
    <Center as="footer" h="2em" mt="auto">
      <Link href="https://lovepik.com/images/png-board.html" isExternal>
        Board Png vectors by Lovepik.com <ExternalLinkIcon mx="2px" />
      </Link>
    </Center>
  );
}

export default function Index() {
  return (
    <Flex
      minH="calc(100vh - 50px)"
      bgGradient="linear(to-r, teal.400, teal.200)"
      direction="column"
    >
      <Flex minW="100vw" justifyContent="center" as="main" wrap="wrap">
        <Box padding="6" mt="12">
          <Heading>Collaborative To Do</Heading>
          <Text mt="10">
            On this website, you can create tasks, either individually or
            collaboratively.
          </Text>
          <Flex gap="4" mt="10">
            <Button as={ReachLink} to="/demo/tasks" colorScheme="red">
              Try Now
            </Button>
            <Button as={ReachLink} to="/login" colorScheme="purple">
              Login
            </Button>
          </Flex>
        </Box>
        <Box>
          <img src="/todo-home.png" height={500} width={500} />
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
}
