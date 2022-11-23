import { createTask, deleteTask, getTasks, updateTask } from "lib/tasks";
import { useEffect, useState, useTransition } from "react";
import { onDeleteTask, onUpdateTask, Task } from "lib/tasks/types";
import { FormValues } from "constants/FormValues/CreateTask";
import TasksSection from "components/TasksSection";
import { TabPanel, useToast } from "@chakra-ui/react";
import BaseTabsLayout from "components/BaseTabsLayout";

function useDemoTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [, startTransition] = useTransition();
  const toast = useToast();
  const createDemoTask = async (taskFormData: FormValues) => {
    try {
      const newTasks = await createTask(false, taskFormData);
      startTransition(() => {
        setTasks(newTasks);
      });
      toast({
        title: `Task ${taskFormData.title} created successfully`,
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (e) {
      toast({
        title: `Task ${taskFormData.title} was not created`,
        status: "error",
        duration: 3000,
        position: "top",
      });
      console.error(e);
    }
  };
  const deleteDemoTask: onDeleteTask = async (data) => {
    const newTasks = await deleteTask(true, data);
    startTransition(() => {
      setTasks(newTasks);
    });
  };
  const updateDemoTask: onUpdateTask = async (data) => {
    const newTasks = await updateTask(true, data);
    startTransition(() => {
      setTasks(newTasks);
    });
  };
  useEffect(() => {
    getTasks(true).then((tasks) => {
      startTransition(() => {
        setTasks(tasks);
      });
    });
  }, []);
  return { tasks, createDemoTask, deleteDemoTask, updateDemoTask };
}

function DemoTasks() {
  const { tasks, createDemoTask, deleteDemoTask, updateDemoTask } =
    useDemoTasks();
  const onSubmit = async (data: FormValues) => {
    await createDemoTask(data);
  };
  return (
    <BaseTabsLayout>
      <TabPanel>
        <TasksSection
          onCreateTask={onSubmit}
          tasks={tasks}
          onDeleteTask={deleteDemoTask}
          onUpdateTask={updateDemoTask}
        />
      </TabPanel>
      <TabPanel>
        <p>two!</p>
      </TabPanel>
    </BaseTabsLayout>
  );
}

export default DemoTasks;
