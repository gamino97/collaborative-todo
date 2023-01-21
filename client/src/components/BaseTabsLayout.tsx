import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function BaseTabsLayout({ children }: Props) {
  return (
    <Box>
      <Container maxW="container.lg" marginTop="20px">
        <Tabs isFitted variant="soft-rounded" colorScheme="blue" isLazy>
          <TabList mb="1em">
            <Tab>My Tasks</Tab>
            <Tab>My Team</Tab>
          </TabList>
          <TabPanels>{children}</TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}
