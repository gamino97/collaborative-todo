import { Box, Center, Heading, Kbd } from "@chakra-ui/react";
import { CreateTask } from "components/CreateTask";
import TaskList from "./TaskList";
import { createTask, getTasks } from "lib/tasks";
import { useEffect, useState } from "react";
import type { Task } from "lib/tasks/types";
import { FormValues } from "constants/FormValues/CreateTask";
import { NoTask } from "components/NoTask";

function MyTasks() {
  // const tasks = getTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const onSubmit = async (data: FormValues) => {
    const newTasks = await createTask(false, data);
    setTasks(newTasks);
  };
  useEffect(() => {
    async function getAsyncTasks() {
      const myTasks = await getTasks(false);
      setTasks(myTasks);
    }
    getAsyncTasks();
  }, []);
  return (
    <Box>
      <CreateTask onCreateTask={onSubmit} />
      <Box mt={4}>
        {tasks.length === 0 ? <NoTask /> : <TaskList tasks={tasks} />}
      </Box>
    </Box>
  );
}

export default MyTasks;
