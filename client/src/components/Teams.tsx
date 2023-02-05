import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { CreateTeam } from "components/CreateTeam";
import Fallback from "components/Fallback";
import { JoinTeam } from "components/JoinTeam";
import QueryError from "components/QueryError";
import { useState } from "react";
import { leaveTeam, useTeam } from "services/team";
import { Team } from "services/types";
import TasksSection from "./TasksSection";
import EmptyTeam from "/box.png";

export function NoTeam() {
  return (
    <>
      <Center>
        <img src={EmptyTeam} alt="No team" loading="lazy" />
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

interface TeamCodeProps {
  team: Team;
}

function TeamCode({ team }: TeamCodeProps) {
  if (team) return <Text>Team code: {team.uuid}</Text>;
  return null;
}

interface LeaveTeamProps {
  team: Team;
  invalidateTeamQuery: () => void;
}
function LeaveTeam({ team, invalidateTeamQuery }: LeaveTeamProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const onSubmit = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await leaveTeam({ teamId: team.id });
        invalidateTeamQuery();
        toast({
          title: response.message,
          status: "success",
          duration: 2000,
          position: "top",
        });
      } catch (e) {
        toast({
          title: "An error occurred while processing your request.",
          status: "error",
          duration: 2000,
          position: "top",
        });
        console.error(e);
      }
      setIsSubmitting(false);
    }
  };
  return (
    <Center>
      <Button variant="link" color="red.500" mt="2" onClick={onOpen}>
        Leave team
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to leave the &quot;{team.name}&quot; team?
            </Text>
            <Flex my={4} justifyContent="end" gap="4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                loadingText="Leaving team"
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={isSubmitting}
                onClick={onSubmit}
              >
                Leave Team
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Center>
  );
}

export default function Teams() {
  const { isLoading, error, data: team, invalidateTeamQuery } = useTeam();
  if (isLoading || !team) return <Fallback />;
  if (error instanceof Error) return <QueryError error={error} />;
  if (team.message) return <NoTeam />;
  return (
    <Box>
      <Center>
        <Heading as="h2" size="2xl">
          {team.name}
        </Heading>
      </Center>
      <Center>
        <TeamCode team={team} />
      </Center>
      <TasksSection mode="network" team={team} />
      <LeaveTeam team={team} invalidateTeamQuery={invalidateTeamQuery} />
    </Box>
  );
}
