import { UnorderedList } from "@chakra-ui/react";
import { Task } from "lib/tasks/types";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  console.log(tasks);
  return (
    <UnorderedList spacing={3} styleType="none" m={0}>
      {tasks.map((task) => {
        return <div key={task.id}>{task.title}</div>;
        // return (
        //   <ListItem
        //     key={task.id}
        //     bg="blue.500"
        //     p={4}
        //     // bg="gray.50"
        //   >
        //     <Flex alignItems="start" justifyContent="space-between">
        //       <Box>
        //         <Heading size="md" as="h5">
        //           {task.title}
        //         </Heading>
        //         <Text>{task.content}</Text>
        //       </Box>
        //       <Button bg="red.600" p={2} borderRadius="lg">
        //         <Icon as={DeleteIcon} w={6} h={6} color="white" />
        //       </Button>
        //     </Flex>
        //   </ListItem>
        // );
      })}
    </UnorderedList>
  );
}
