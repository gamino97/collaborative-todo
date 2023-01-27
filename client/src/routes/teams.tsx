import { TabPanel, TabPanels } from "@chakra-ui/react";
import Teams from "components/Teams";

function NetworkTeams() {
  return (
    <>
      <TabPanels>
        <TabPanel></TabPanel>
        <TabPanel>
          <Teams />
        </TabPanel>
      </TabPanels>
    </>
  );
}

export default NetworkTeams;
