import { useToast } from "@chakra-ui/react";
import { FormValues } from "constants/FormValues/CreateTask";
import { createTask, deleteTask, getTasks, updateTask } from "lib/tasks";
import { onDeleteTask, onDoneTask, onUpdateTask, Task } from "lib/tasks/types";
import { useEffect, useState, useTransition } from "react";

function useDemoTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [, startTransition] = useTransition();
  const toast = useToast();
  const createDemoTask = async (taskFormData: FormValues) => {
    try {
      const newTasks = await createTask(true, taskFormData);
      startTransition(() => {
        setTasks(newTasks);
      });
      toast({
        title: `Task ${taskFormData.title} created successfully`,
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (e) {
      toast({
        title: `Task ${taskFormData.title} was not created`,
        status: "error",
        duration: 3000,
        position: "top",
      });
      console.error(e);
    }
  };
  const deleteDemoTask: onDeleteTask = async (data) => {
    const newTasks = await deleteTask(true, data);
    startTransition(() => {
      setTasks(newTasks);
    });
  };
  const updateDemoTask: onUpdateTask = async (data) => {
    const newTasks = await updateTask(true, data);
    startTransition(() => {
      setTasks(newTasks);
    });
  };
  const onDoneTask: onDoneTask = async (data) => {
    const newTasks = await updateTask(true, { ...data, done: !data.done });
    startTransition(() => {
      setTasks(newTasks);
    });
  };
  useEffect(() => {
    getTasks(true).then((tasks) => {
      startTransition(() => {
        setTasks(tasks);
      });
    });
  }, []);
  return { tasks, createDemoTask, deleteDemoTask, updateDemoTask, onDoneTask };
}

export { useDemoTasks };
