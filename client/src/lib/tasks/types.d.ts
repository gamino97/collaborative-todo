import { TaskFormValues } from "constants/FormValues/CreateTask";

export interface Task {
  id: string;
  title: string;
  description: string;
  done: boolean;
  created_at: string;
}

export interface onDeleteTask {
  (task: Task): Promise<void>;
}

export interface onUpdateTask {
  (task: Task): Promise<void>;
}

export interface onDoneTask {
  (task: Task): Promise<void>;
}

export interface TasksSetter {
  (tasks: Task[]): Promise<Task[]>;
}

export interface TasksGetter {
  (): Promise<Task[]>;
}

export interface TaskCreate {
  (data: TaskFormValues): Promise<Task>;
}
export interface TaskUpdate {
  (data: Task): Promise<Task>;
}

export interface TaskDelete {
  (data: Task): Promise<void>;
}

// Change to Enum
export type Mode = "network" | "demo";
