import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { joinTeam, useTeam } from "services/team";

interface JoinTeamForm {
  code: string;
}
// Mostrar lista de tasks de team en la pestaña de my team
export function JoinTeam() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { invalidateTeamQuery } = useTeam();
  const methods = useForm<JoinTeamForm>();
  const {
    reset,
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
  } = methods;
  const toast = useToast();
  const onSubmit: SubmitHandler<JoinTeamForm> = async (data) => {
    try {
      const response = await joinTeam({ code: data.code });
      invalidateTeamQuery();
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "An error ocurred while processing your request.",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };
  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Join Team
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} onCloseComplete={reset}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join Team with code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={Boolean(errors.code)}>
                <FormLabel htmlFor="code">Code</FormLabel>
                <Input
                  id="code"
                  placeholder="Code"
                  {...register("code", {
                    required: "This field is required",
                  })}
                  autoFocus
                />
                <FormErrorMessage>
                  {errors.code && errors.code.message}
                </FormErrorMessage>
              </FormControl>
              <Flex my={4} justifyContent="end">
                <Button
                  colorScheme="blue"
                  mr={3}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Join Team
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
