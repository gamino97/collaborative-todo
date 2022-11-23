import { Box, Skeleton, Stack } from "@chakra-ui/react";
import { CreateTask } from "components/CreateTask";
import { Task, onDeleteTask, onUpdateTask } from "lib/tasks/types";
import { lazy, Suspense } from "react";
import { FormValues } from "constants/FormValues/CreateTask";

const NoTask = lazy(() => import("components/NoTask"));
const TaskList = lazy(() => import("components/TaskList"));

interface Props {
  onCreateTask: (data: FormValues) => Promise<void>;
  tasks: Task[];
  onDeleteTask: onDeleteTask;
  onUpdateTask: onUpdateTask;
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

const TasksSection = ({
  onCreateTask,
  tasks,
  onDeleteTask,
  onUpdateTask,
}: Props) => {
  return (
    <Box>
      <CreateTask onCreateTask={onCreateTask} />
      <Box mt={4}>
        <Suspense fallback={<LoadingTaskSection />}>
          {tasks.length === 0 ? (
            <NoTask />
          ) : (
            <TaskList
              tasks={tasks}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
            />
          )}
        </Suspense>
      </Box>
    </Box>
  );
};

export default TasksSection;
