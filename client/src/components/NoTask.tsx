import NoTaskImage from "/no-task.png";
import { Center, Heading, Kbd } from "@chakra-ui/react";

const NoTask = () => {
  return (
    <>
      <Center>
        <img src={NoTaskImage} alt="No task" />
      </Center>
      <Center>
        <Heading as="h2" size="xl">
          You don&apos;t have any tasks.
        </Heading>
      </Center>
      <Center>
        <span>
          Press <Kbd>alt</Kbd> + <Kbd>N</Kbd> to create tasks.
        </span>
      </Center>
    </>
  );
};

export default NoTask;
