import NoTaskImage from "/no-task.png";
import { Center, Heading, Kbd } from "@chakra-ui/react";
import { Team } from "services/types";

interface Props {
  team?: Team;
}

const NoTask = ({ team }: Props) => {
  return (
    <>
      <Center>
        <img src={NoTaskImage} alt="No task" />
      </Center>
      <Center>
        <Heading as="h2" size="xl">
          You don&apos;t have any registered task{team && ` in ${team.name}`}.
        </Heading>
      </Center>
      <Center>
        <span>
          Press <Kbd>alt</Kbd> + <Kbd>N</Kbd> to create one.
        </span>
      </Center>
    </>
  );
};

export default NoTask;
