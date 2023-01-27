import { TabPanel, TabPanels } from "@chakra-ui/react";
import TasksSection from "components/TasksSection";

function NetworkTasks() {
  return (
    <>
      <TabPanels>
        <TabPanel>
          <TasksSection mode="network" />
        </TabPanel>
        <TabPanel></TabPanel>
      </TabPanels>
    </>
  );
}

export default NetworkTasks;
