import type { Task } from "lib/tasks/types";
import localforage from "localforage";

export async function set(tasks: Task[]) {
  return await localforage.setItem<Task[]>("tasks", tasks);
}

export async function get() {
  let tasks = await localforage.getItem<Array<Task>>("tasks");
  if (!tasks) tasks = [];
  return tasks;
}
