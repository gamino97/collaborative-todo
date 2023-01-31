import { Box, Flex } from "@chakra-ui/react";
import { CreateTask } from "components/CreateTask";
import TaskList from "components/TaskList";
import { Mode } from "lib/tasks/types";
import { Team } from "services/types";
import SearchForm from "components/SearchForm";

interface Props {
  mode: Mode;
  team?: Team;
}

const TasksSection = ({ mode, team }: Props) => {
  return (
    <Box>
      <CreateTask mode={mode} team={team} />
      <Box mt={4}>
        <SearchForm />
      </Box>
      <Box mt={4}>
        <TaskList mode={mode} team={team} />
      </Box>
    </Box>
  );
};

export default TasksSection;
