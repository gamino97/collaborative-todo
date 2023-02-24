import { useToast } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskFormValues } from "constants/FormValues/CreateTask";
import { useSearchTask } from "hooks/filter";
import { createTask, deleteTask, getTasks, updateTask } from "lib/tasks";
import { Mode, onDeleteTask, onDoneTask, Task } from "lib/tasks/types";
import { Team } from "services/types";

function useTasks(mode: Mode, team?: Team) {
  const q = useSearchTask();
  const queryClient = useQueryClient();
  const tasksQuery = useQuery({
    queryKey: [
      mode,
      "tasks",
      "list",
      q || "all",
      q,
      team?.name || "No team",
      team,
    ],
    queryFn: () => getTasks(mode, q, team),
    networkMode: mode === "demo" ? "always" : "online",
  });
  const toast = useToast();

  const handleCreateTask = async (
    taskFormData: TaskFormValues,
    team: boolean
  ) => {
    await createTask(mode, taskFormData, team);
    await queryClient.invalidateQueries([mode, "tasks", "list"]);
    toast({
      title: `Task "${taskFormData.title}" created successfully`,
      status: "success",
      duration: 2000,
      position: "top",
    });
  };

  const handleDeleteTask: onDeleteTask = async (data) => {
    await deleteTask(mode, data);
    await queryClient.invalidateQueries([mode, "tasks"]);
  };

  const handleUpdateTask = async (data: Task) => {
    await updateTask(mode, data);
    await queryClient.invalidateQueries([mode, "tasks"]);
  };

  const handleDoneTask: onDoneTask = async (data) => {
    await updateTask(mode, { ...data, done: !data.done });
    await queryClient.invalidateQueries([mode, "tasks"]);
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
