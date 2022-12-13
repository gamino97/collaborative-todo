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

export const create: TaskCreate = async (data) => {
  const res = await apiClient.post("/tasks/create", {
    title: data.title,
    description: data.description,
  });
  return res.data;
};

export const update: TaskUpdate = async (task) => {
  const { title, description, done } = task;
  const res = await apiClient.post(`/tasks/update/${task.uuid}`, {
    title,
    description,
    done,
  });
  return res.data;
};

export const erase: TaskDelete = async (task) => {
  const { uuid } = task;
  const res = await apiClient.post(`/tasks/delete/${uuid}`);
  console.log({ resDelete: res.data });
};
