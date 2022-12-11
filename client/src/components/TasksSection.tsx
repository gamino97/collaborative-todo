import { Box, Skeleton, Stack } from "@chakra-ui/react";
import { CreateTask } from "components/CreateTask";
import { Task, onDeleteTask, onUpdateTask, onDoneTask } from "lib/tasks/types";
import { lazy, Suspense } from "react";
import { TaskFormValues } from "constants/FormValues/CreateTask";
import TaskList from "components/TaskList";

// const NoTask = lazy(() => import("components/NoTask"));
// const TaskList = lazy(() => import("components/TaskList"));

interface Props {
  onCreateTask: (data: TaskFormValues) => Promise<void>;
  tasks: Task[];
  onDeleteTask: onDeleteTask;
  onUpdateTask: onUpdateTask;
  onDoneTask: onDoneTask;
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
  onDoneTask,
}: Props) => {
  return (
    <Box>
      <CreateTask onCreateTask={onCreateTask} />
      <Box mt={4}>
        <TaskList
          tasks={tasks}
          onDeleteTask={onDeleteTask}
          onUpdateTask={onUpdateTask}
          onDoneTask={onDoneTask}
        />
      </Box>
    </Box>
  );
};

export default TasksSection;
