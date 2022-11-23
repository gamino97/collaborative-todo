import { matchSorter } from "match-sorter";
import { sortBy } from "sort-by-typescript";
import { FormValues } from "constants/FormValues/CreateTask";
import { Task } from "lib/tasks/types";

export async function getTasks(isDemo: boolean, query?: string) {
  let get;
  if (isDemo) {
    ({ get } = await import("lib/tasks/network"));
  } else {
    ({ get } = await import("lib/tasks/demo"));
  }
  let tasks: Task[] = await get();
  if (query) {
    tasks = matchSorter(tasks, query, { keys: ["first", "last"] });
  }
  return tasks.sort(sortBy("-createdAt"));
}

export async function createTask(isDemo: boolean, data: FormValues) {
  let set;
  const id = Math.random().toString(36).substring(2, 9);
  const task = { ...data, id };
  const tasks = await getTasks(isDemo);
  if (isDemo) {
    ({ set } = await import("lib/tasks/network"));
  } else {
    ({ set } = await import("lib/tasks/demo"));
  }
  tasks.unshift(task);
  await set(tasks);
  return tasks;
}

export async function deleteTask(isDemo: boolean, task: Task) {
  const currentTasks = await getTasks(isDemo);
  const newTasks = currentTasks.filter((t) => t.id !== task.id);
  const { set } = await import("lib/tasks/demo");
  await set(newTasks);
  return newTasks;
}

export async function updateTask(isDemo: boolean, task: Task) {
  const currentTasks = await getTasks(isDemo);
  const updatedTasks = currentTasks.map((storedTask) => {
    return storedTask.id === task.id ? task : storedTask;
  });
  let set;
  if (isDemo) {
    ({ set } = await import("lib/tasks/network"));
  } else {
    ({ set } = await import("lib/tasks/demo"));
  }
  await set(updatedTasks);
  return updatedTasks;
}
