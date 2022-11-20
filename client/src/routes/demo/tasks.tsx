import { createTask, getTasks } from "lib/tasks";
import { useEffect, useState, useTransition } from "react";
import type { Task } from "lib/tasks/types";
import { FormValues } from "constants/FormValues/CreateTask";
import TasksSection from "components/TasksSection";
import { TabPanel } from "@chakra-ui/react";
import BaseTabsLayout from "components/BaseTabsLayout";

function DemoTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [, startTransition] = useTransition();
  const onSubmit = async (data: FormValues) => {
    const newTasks = await createTask(false, data);
    startTransition(() => {
      setTasks(newTasks);
    });
  };
  useEffect(() => {
    async function getAsyncTasks() {
      const myTasks = await getTasks(false);
      startTransition(() => {
        setTasks(myTasks);
      });
    }
    getAsyncTasks();
  }, []);
  return (
    <BaseTabsLayout>
      <TabPanel>
        <TasksSection onCreateTask={onSubmit} tasks={tasks} />
      </TabPanel>
      <TabPanel>
        <p>two!</p>
      </TabPanel>
    </BaseTabsLayout>
  );
}

export default DemoTasks;
