import { matchSorter } from "match-sorter";
import { sortBy } from "sort-by-typescript";
import { FormValues } from "constants/FormValues/CreateTask";

export async function getTasks(isLoggedIn: boolean, query?: string) {
  let get;
  if (isLoggedIn) {
    ({ get } = await import("lib/tasks/network"));
  } else {
    ({ get } = await import("lib/tasks/local"));
  }
  let tasks = await get();
  if (query) {
    tasks = matchSorter(tasks, query, { keys: ["first", "last"] });
  }
  return tasks.sort(sortBy("-createdAt"));
}

export async function createTask(isLoggedIn: boolean, data: FormValues) {
  let set;
  const id = Math.random().toString(36).substring(2, 9);
  const task = { ...data, id };
  const tasks = await getTasks(isLoggedIn);
  if (isLoggedIn) {
    ({ set } = await import("lib/tasks/network"));
  } else {
    ({ set } = await import("lib/tasks/local"));
  }
  tasks.unshift(task);
  await set(tasks);
  return tasks;
}
