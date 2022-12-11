import { TasksGetter, TasksSetter } from "lib/tasks/types";
import apiClient from "lib/apiClient";

export const set: TasksSetter = async (tasks) => {
  const newTask = tasks[0];
  const res = await apiClient.post("/tasks/create", {
    title: newTask.title,
    description: newTask.content,
  });
  const newTasks = [...tasks];
  newTasks[0] = res.data;
  return newTasks;
};

export const get: TasksGetter = async () => {
  return await apiClient.get("/tasks/list").then((res) => res.data);
};
