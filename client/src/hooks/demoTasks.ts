import { useToast } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormValues } from "constants/FormValues/CreateTask";
import { useSearchTask } from "hooks/filter";
import { createTask, deleteTask, getTasks, updateTask } from "lib/tasks";
import { onDeleteTask, onDoneTask, onUpdateTask } from "lib/tasks/types";

function useDemoTasks() {
  const q = useSearchTask();
  const queryClient = useQueryClient();
  const { data: tasks } = useQuery({
    networkMode: "always",
    queryKey: ["demo", "tasks", "list", q || "all", q],
    queryFn: () => getTasks(true, q),
  });
  const toast = useToast();

  const createDemoTask = async (taskFormData: FormValues) => {
    try {
      await createTask(true, taskFormData);
      queryClient.invalidateQueries(["demo", "tasks", "list"]);
      toast({
        title: `Task "${taskFormData.title}" created successfully`,
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (e) {
      toast({
        title: `Task "${taskFormData.title}" was not created`,
        status: "error",
        duration: 3000,
        position: "top",
      });
      console.error(e);
    }
  };

  const deleteDemoTask: onDeleteTask = async (data) => {
    await deleteTask(true, data);
    queryClient.invalidateQueries(["demo", "tasks"]);
  };

  const updateDemoTask: onUpdateTask = async (data) => {
    await updateTask(true, data);
    queryClient.invalidateQueries(["demo", "tasks"]);
  };

  const onDoneTask: onDoneTask = async (data) => {
    await updateTask(true, { ...data, done: !data.done });
    queryClient.invalidateQueries(["demo", "tasks"]);
  };

  return { tasks, createDemoTask, deleteDemoTask, updateDemoTask, onDoneTask };
}

export { useDemoTasks };
