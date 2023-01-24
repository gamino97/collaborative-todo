import { Heading, Center } from "@chakra-ui/react";
import { CreateTeam } from "components/CreateTeam";
import { JoinTeam } from "components/JoinTeam";
import { useTeam } from "services/team";
import Fallback from "components/Fallback";
import QueryError from "components/QueryError";
import TasksSection from "./TasksSection";

export function NoTeam() {
  return (
    <>
      <Center>
        <img src="/box.png" alt="No team" loading="lazy" />
      </Center>
      <Center>
        <Heading as="h2" size="xl">
          You are not associated with any team.
        </Heading>
      </Center>
      <Center gap={4} mt={4}>
        <CreateTeam />
        <JoinTeam />
      </Center>
    </>
  );
}

export default function Teams() {
  const { isLoading, error, data: team } = useTeam();
  if (isLoading || !team) return <Fallback />;
  if (error instanceof Error) return <QueryError error={error} />;
  if (team.message) return NoTeam;
  return (
    <>
      <Center>
        <Heading as="h2" size="2xl">
          {team.name}
        </Heading>
      </Center>
      <TasksSection mode="network" team={team} />
    </>
  );
}
