import { Center, Heading, Link, TabPanel } from "@chakra-ui/react";
import BaseTabsLayout from "components/BaseTabsLayout";
import TasksSection from "components/TasksSection";
import { FormValues } from "constants/FormValues/CreateTask";
import { useDemoTasks } from "hooks/demoTasks";
import { Link as ReachLink } from "react-router-dom";

function DemoTasksSection() {
  const { tasks, createDemoTask, deleteDemoTask, updateDemoTask, onDoneTask } =
    useDemoTasks();
  const onSubmit = async (data: FormValues) => {
    await createDemoTask(data);
  };
  return (
    <TasksSection
      onCreateTask={onSubmit}
      tasks={tasks}
      onDeleteTask={deleteDemoTask}
      onUpdateTask={updateDemoTask}
      onDoneTask={onDoneTask}
    />
  );
}

function DemoTasks() {
  return (
    <BaseTabsLayout>
      <TabPanel>
        <DemoTasksSection />
      </TabPanel>
      <TabPanel>
        <Center>
          <Heading as="h2" size="md">
            If you want to manage teams, you can{" "}
            <Link as={ReachLink} to="/login" color="teal.500">
              Log in
            </Link>
            {" or "}
            <Link as={ReachLink} to="/register" color="teal.500">
              Register{" "}
            </Link>
          </Heading>
        </Center>
      </TabPanel>
    </BaseTabsLayout>
  );
}

export default DemoTasks;
