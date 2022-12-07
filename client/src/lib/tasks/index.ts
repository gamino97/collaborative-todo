import { matchSorter } from "match-sorter";
import { sortBy } from "sort-by-typescript";
import { FormValues } from "constants/FormValues/CreateTask";
import { Task, TasksGetter, TasksSetter } from "lib/tasks/types";

export async function getTasks(isDemo: boolean, query?: string) {
  let get: TasksGetter;
  if (isDemo) {
    ({ get } = await import("lib/tasks/demo"));
  } else {
    ({ get } = await import("lib/tasks/network"));
  }
  let tasks = await get();
  if (query) {
    tasks = matchSorter(tasks, query, { keys: ["first", "last"] });
  }
  return tasks.sort(sortBy("-createdAt"));
}

export async function createTask(isDemo: boolean, data: FormValues) {
  let set: TasksSetter;
  const id = Math.random().toString(36).substring(2, 9);
  const task: Task = { ...data, id, done: false };
  const tasks = await getTasks(isDemo);
  if (isDemo) {
    ({ set } = await import("lib/tasks/demo"));
  } else {
    ({ set } = await import("lib/tasks/network"));
  }
  tasks.unshift(task);
  await set(tasks);
  return tasks;
}

export async function deleteTask(isDemo: boolean, task: Task) {
  const currentTasks = await getTasks(isDemo);
  const newTasks = currentTasks.filter((t) => t.id !== task.id);
  let set: TasksSetter;
  if (isDemo) {
    ({ set } = await import("lib/tasks/network"));
  } else {
    ({ set } = await import("lib/tasks/demo"));
  }
  await set(newTasks);
  return newTasks;
}

export async function updateTask(isDemo: boolean, task: Task) {
  const currentTasks = await getTasks(isDemo);
  const updatedTasks = currentTasks.map((storedTask) => {
    return storedTask.id === task.id ? task : storedTask;
  });
  let set: TasksSetter;
  if (isDemo) {
    ({ set } = await import("lib/tasks/network"));
  } else {
    ({ set } = await import("lib/tasks/demo"));
  }
  await set(updatedTasks);
  return updatedTasks;
}
