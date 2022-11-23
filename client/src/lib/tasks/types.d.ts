export type Task = {
  id: string;
  title: string;
  content?: string;
};

export interface onDeleteTask {
  (task: Task): Promise<void>;
}

export interface onUpdateTask {
  (task: Task): Promise<void>;
}
