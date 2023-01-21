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
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { createTeam } from "services/team";

interface CreateTeamForm {
  name: string;
}
export function CreateTeam() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const methods = useForm<CreateTeamForm>();
  const {
    reset,
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
  } = methods;
  const toast = useToast();
  const onSubmit: SubmitHandler<CreateTeamForm> = async (data) => {
    try {
      const newTeam = await createTeam({ data });
      toast({
        title: `${newTeam.name} created succesfully`,
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: `Error creating "${data.name}"`,
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };
  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Create Team
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} onCloseComplete={reset}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={Boolean(errors.name)}>
                  <FormLabel htmlFor="name">Title</FormLabel>
                  <Input
                    id="name"
                    placeholder="Title"
                    {...register("name", {
                      required: "This field is required",
                    })}
                    autoFocus
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <Flex my={4} justifyContent="end">
                  <Button
                    colorScheme="blue"
                    mr={3}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Create Team
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </Flex>
              </form>
            </FormProvider>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
