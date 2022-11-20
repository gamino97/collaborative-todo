import { Box, Stack, Skeleton } from "@chakra-ui/react";
import { CreateTask } from "components/CreateTask";
import type { Task } from "lib/tasks/types";
import { lazy, Suspense } from "react";
const NoTask = lazy(() => import("components/NoTask"));
const TaskList = lazy(() => import("components/TaskList"));
import { FormValues } from "constants/FormValues/CreateTask";

interface Props {
  onCreateTask: (data: FormValues) => Promise<void>;
  tasks: Task[];
}

function LoadingTaskSection() {
  return (
    <Stack>
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  );
}

const TasksSection = ({ onCreateTask, tasks }: Props) => {
  return (
    <Box>
      <CreateTask onCreateTask={onCreateTask} />
      <Box mt={4}>
        <Suspense fallback={<LoadingTaskSection />}>
          {tasks.length === 0 ? <NoTask /> : <TaskList tasks={tasks} />}
        </Suspense>
      </Box>
    </Box>
  );
};

export default TasksSection;
