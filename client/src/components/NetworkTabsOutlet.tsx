import { Box, Container, Tab, TabList, Tabs } from "@chakra-ui/react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function NetworkTabsOutlet() {
  const location = useLocation();
  const isMyTasksActive = location.pathname === "/tasks";
  return (
    <Box>
      <Container maxW="container.lg" marginTop="20px">
        <Tabs
          isFitted
          variant="soft-rounded"
          colorScheme="blue"
          index={isMyTasksActive ? 0 : 1}
        >
          <TabList mb="1em">
            <Tab to="/tasks" as={Link}>
              My Tasks
            </Tab>
            <Tab to="/teams" as={Link}>
              My Team
            </Tab>
          </TabList>
          <Outlet />
        </Tabs>
      </Container>
    </Box>
  );
}
