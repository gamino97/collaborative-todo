import {
  Task,
  TaskCreate,
  TasksGetter,
  TasksSetter,
  TaskUpdate,
  TaskDelete,
} from "lib/tasks/types";
import localforage from "localforage";

export const set: TasksSetter = async (tasks) => {
  return await localforage.setItem<Task[]>("tasks", tasks);
};

export const get: TasksGetter = async () => {
  let tasks = await localforage.getItem<Task[]>("tasks");
  if (!tasks) tasks = [];
  return tasks;
};

export const create: TaskCreate = async (data) => {
  const id = Math.random().toString(36).substring(2, 9);
  const now = new Date();
  const task: Task = {
    ...data,
    id,
    done: false,
    created_at: now.toJSON(),
    team_id: null,
    author_id: 1,
  };
  const tasks = await get();
  tasks.unshift(task);
  await set(tasks);
  return task;
};

export const update: TaskUpdate = async (task) => {
  const currentTasks = await get();
  const updatedTasks = currentTasks.map((storedTask) => {
    return storedTask.id === task.id ? task : storedTask;
  });
  await set(updatedTasks);
  return task;
};

export const erase: TaskDelete = async (task) => {
  const currentTasks = await get();
  const newTasks = currentTasks.filter((t) => t.id !== task.id);
  await set(newTasks);
};
