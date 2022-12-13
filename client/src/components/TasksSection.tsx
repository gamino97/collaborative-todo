import { Box } from "@chakra-ui/react";
import { CreateTask } from "components/CreateTask";
import TaskList from "components/TaskList";
import { Mode } from "lib/tasks/types";

interface Props {
  mode: Mode;
}

const TasksSection = ({ mode }: Props) => {
  return (
    <Box>
      <CreateTask mode={mode} />
      <Box mt={4}>
        <TaskList mode={mode} />
      </Box>
    </Box>
  );
};

export default TasksSection;
