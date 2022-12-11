import { useToast } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskFormValues } from "constants/FormValues/CreateTask";
import { useSearchTask } from "hooks/filter";
import { createTask, deleteTask, getTasks, updateTask } from "lib/tasks";
import { onDeleteTask, onDoneTask, onUpdateTask } from "lib/tasks/types";

function useNetworkTasks() {
  const q = useSearchTask();
  const queryClient = useQueryClient();
  const { data: tasks } = useQuery({
    networkMode: "always",
    queryKey: ["network", "tasks", "list", q || "all", q],
    queryFn: () => getTasks(false, q),
  });
  const toast = useToast();

  const createDemoTask = async (taskFormData: TaskFormValues) => {
    await createTask(false, taskFormData);
    queryClient.invalidateQueries(["network", "tasks", "list"]);
    toast({
      title: `Task "${taskFormData.title}" created successfully`,
      status: "success",
      duration: 2000,
      position: "top",
    });
  };

  const deleteDemoTask: onDeleteTask = async (data) => {
    await deleteTask(true, data);
    queryClient.invalidateQueries(["network", "tasks"]);
  };

  const updateDemoTask: onUpdateTask = async (data) => {
    await updateTask(true, data);
    queryClient.invalidateQueries(["network", "tasks"]);
  };

  const onDoneTask: onDoneTask = async (data) => {
    await updateTask(true, { ...data, done: !data.done });
    queryClient.invalidateQueries(["network", "tasks"]);
  };

  return { tasks, createDemoTask, deleteDemoTask, updateDemoTask, onDoneTask };
}

export { useNetworkTasks };
