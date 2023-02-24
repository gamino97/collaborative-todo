import {
  TaskCreate,
  TaskDelete,
  TasksGetter,
  TasksSetter,
  TaskUpdate,
} from "lib/tasks/types";
import apiClient from "lib/apiClient";

export const set: TasksSetter = async (tasks) => {
  const newTask = tasks[0];
  const res = await apiClient.post("/tasks/create", {
    title: newTask.title,
    description: newTask.description,
  });
  const newTasks = [...tasks];
  newTasks[0] = res.data;
  return newTasks;
};

export const get: TasksGetter = async () => {
  return await apiClient.get("/tasks/list").then((res) => res.data);
};

export const create: TaskCreate = async (data, team) => {
  const res = await apiClient.post("/tasks/create", {
    title: data.title,
    description: data.description,
    team: team,
  });
  return res.data;
};

export const update: TaskUpdate = async (task) => {
  const { title, description, done } = task;
  const res = await apiClient.patch(`/tasks/update/${task.id}`, {
    title,
    description,
    done,
  });
  return res.data;
};

export const erase: TaskDelete = async (task) => {
  const { id } = task;
  return await apiClient.post(`/tasks/delete/${id}`);
};
