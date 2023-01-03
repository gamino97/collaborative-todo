import {
  Heading,
  Center,
} from "@chakra-ui/react";
import { CreateTeam } from "components/CreateTeam";
import { JoinTeam } from "components/JoinTeam";

export default function Teams() {
  return (
    <>
      <Center>
        <img src="/box.png" alt="No team" loading="lazy" />
      </Center>
      <Center>
        <Heading as="h2" size="xl">
          You are not part of a team.
        </Heading>
      </Center>
      <Center gap={4} mt={4}>
        <CreateTeam />
        <JoinTeam />
      </Center>
    </>
  );
}
