import { matchSorter } from "match-sorter";
import { sortBy } from "sort-by-typescript";
import { FormValues } from "constants/FormValues/CreateTask";

export async function getTasks(isDemo: boolean, query?: string) {
  let get;
  if (isDemo) {
    ({ get } = await import("lib/tasks/network"));
  } else {
    ({ get } = await import("lib/tasks/demo"));
  }
  let tasks = await get();
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
