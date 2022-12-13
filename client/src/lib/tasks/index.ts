import { matchSorter } from "match-sorter";
import { sortBy } from "sort-by-typescript";
import { TaskFormValues } from "constants/FormValues/CreateTask";
import {
  Task,
  TasksGetter,
  TasksSetter,
  Mode,
  TaskCreate,
  TaskUpdate,
  TaskDelete,
} from "lib/tasks/types";

export async function getTasks(mode: Mode, query?: string) {
  let get: TasksGetter;
  if (mode === "demo") {
    ({ get } = await import("lib/tasks/demo"));
  } else {
    ({ get } = await import("lib/tasks/network"));
  }
  let tasks = await get();
  if (query) {
    tasks = matchSorter(tasks, query, { keys: ["first", "last"] });
  }
  return tasks.sort(sortBy("-created_at"));
}

export async function createTask(mode: Mode, data: TaskFormValues) {
  let create: TaskCreate;
  if (mode === "demo") {
    ({ create } = await import("lib/tasks/demo"));
  } else {
    ({ create } = await import("lib/tasks/network"));
  }
  return await create(data);
}

export async function deleteTask(mode: Mode, task: Task) {
  let erase: TaskDelete;
  if (mode === "network") {
    ({ erase } = await import("lib/tasks/network"));
  } else {
    ({ erase } = await import("lib/tasks/demo"));
  }
  await erase(task);
}

export async function updateTask(mode: Mode, task: Task) {
  let update: TaskUpdate;
  if (mode === "network") {
    ({ update } = await import("lib/tasks/network"));
  } else {
    ({ update } = await import("lib/tasks/demo"));
  }
  return await update(task);
}
