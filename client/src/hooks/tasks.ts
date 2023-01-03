import { useToast } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskFormValues } from "constants/FormValues/CreateTask";
import { useSearchTask } from "hooks/filter";
import { createTask, deleteTask, getTasks, updateTask } from "lib/tasks";
import { onDeleteTask, onDoneTask, Mode, Task } from "lib/tasks/types";

function useTasks(mode: Mode) {
  const q = useSearchTask();
  const queryClient = useQueryClient();
  const tasksQuery = useQuery({
    queryKey: [mode, "tasks", "list", q || "all", q],
    queryFn: () => getTasks(mode, q),
    networkMode: mode === "demo" ? "always" : "online",
    staleTime: Infinity,
  });
  const toast = useToast();

  const handleCreateTask = async (taskFormData: TaskFormValues) => {
    await createTask(mode, taskFormData);
    queryClient.invalidateQueries([mode, "tasks", "list"]);
    toast({
      title: `Task "${taskFormData.title}" created successfully`,
      status: "success",
      duration: 2000,
      position: "top",
    });
  };

  const handleDeleteTask: onDeleteTask = async (data) => {
    await deleteTask(mode, data);
    queryClient.invalidateQueries([mode, "tasks"]);
  };

  const handleUpdateTask = async (data: Task) => {
    await updateTask(mode, data);
    queryClient.invalidateQueries([mode, "tasks"]);
  };

  const handleDoneTask: onDoneTask = async (data) => {
    await updateTask(mode, { ...data, done: !data.done });
    queryClient.invalidateQueries([mode, "tasks"]);
  };

  return {
    tasksQuery,
    handleCreateTask,
    handleDeleteTask,
    handleUpdateTask,
    handleDoneTask,
  };
}

export { useTasks };
