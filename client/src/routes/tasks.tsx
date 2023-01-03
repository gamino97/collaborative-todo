import { Box, Center, TabPanel } from "@chakra-ui/react";
import BaseTabsLayout from "components/BaseTabsLayout";
import TasksSection from "components/TasksSection";
import Teams from "components/Teams";

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
      <Box>
          <Teams />
      </Box>
      </TabPanel>
    </BaseTabsLayout>
  );
}

export default NetworkTasks;
