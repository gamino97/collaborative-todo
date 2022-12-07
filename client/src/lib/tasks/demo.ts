import { Task, TasksGetter, TasksSetter } from "lib/tasks/types";
import localforage from "localforage";

export const set: TasksSetter = async (tasks) => {
  return await localforage.setItem<Task[]>("tasks", tasks);
};

export const get: TasksGetter = async () => {
  let tasks = await localforage.getItem<Task[]>("tasks");
  if (!tasks) tasks = [];
  return tasks;
};
