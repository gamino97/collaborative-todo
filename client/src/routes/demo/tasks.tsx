import { Center, Heading, Link, TabPanel } from "@chakra-ui/react";
import BaseTabsLayout from "components/BaseTabsLayout";
import TasksSection from "components/TasksSection";
import { Link as ReachLink } from "react-router-dom";

function DemoTasksSection() {
  return <TasksSection mode="demo" />;
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
            If you want to create or join a team, you must{" "}
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
