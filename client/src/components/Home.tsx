import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
} from "@chakra-ui/react";
import MyTasks from "components/MyTasks";

export default function Home() {
  return (
    <Box>
      {/*<Head>*/}
      {/*  <title>Collaborative Todo List</title>*/}
      {/*</Head>*/}
      <Container maxW="container.lg" marginTop="20px">
        <Tabs isFitted variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em">
            <Tab>My Tasks</Tab>
            <Tab>My Team</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <MyTasks />
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}
