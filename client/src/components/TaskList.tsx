import {
  Box,
  UnorderedList,
  ListItem,
  Heading,
  Text,
  Icon,
  Flex,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

export default function TaskList({ tasks }: { tasks: Array<Object> }) {
  return (
    <UnorderedList spacing={3} styleType="none" m={0}>
      {tasks.map((task) => {
        return (
          <ListItem
            key={task.id}
            bg="blue.500"
            p={4}
            // bg="gray.50"
          >
            <Flex alignItems="start" justifyContent="space-between">
              <Box>
                <Heading size="md" as="h5">
                  {task.title}
                </Heading>
                <Text>{task.content}</Text>
              </Box>
              <Button bg="red.600" p={2} borderRadius="lg">
                <Icon as={DeleteIcon} w={6} h={6} color="white" />
              </Button>
            </Flex>
          </ListItem>
        );
      })}
    </UnorderedList>
  );
}
