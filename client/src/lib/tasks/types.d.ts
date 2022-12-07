export interface Task {
  id: string;
  title: string;
  content?: string;
  done: boolean;
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
