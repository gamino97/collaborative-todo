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
import { Team } from "services/types";

export async function getTasks(mode: Mode, query?: string, team?: Team) {
  let get: TasksGetter;
  if (mode === "demo") {
    ({ get } = await import("lib/tasks/demo"));
  } else {
    ({ get } = await import("lib/tasks/network"));
  }
  let tasks = await get();
  if (team && mode === "network") {
    tasks = tasks.filter((task) => {
      return task.team_id === team?.id;
    });
  } else {
    tasks = tasks.filter((task) => !task.team_id);
  }
  if (query) {
    tasks = matchSorter(tasks, query, { keys: ["title", "description"] });
  }
  return tasks.sort(sortBy("done", "-created_at"));
}

export async function createTask(
  mode: Mode,
  data: TaskFormValues,
  team: boolean
) {
  let create: TaskCreate;
  if (mode === "demo") {
    ({ create } = await import("lib/tasks/demo"));
    return await create(data);
  }
  ({ create } = await import("lib/tasks/network"));
  return await create(data, team);
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
