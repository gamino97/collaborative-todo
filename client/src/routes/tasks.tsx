import { Center, Heading, Link, TabPanel } from "@chakra-ui/react";
import BaseTabsLayout from "components/BaseTabsLayout";
import TasksSection from "components/TasksSection";
import { Link as ReachLink } from "react-router-dom";

function NetworkTasksSection() {
  return <TasksSection mode="network" />;
}

function NetworkTasks() {
  return (
    <BaseTabsLayout>
      <TabPanel>
        <NetworkTasksSection />
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

export default NetworkTasks;
