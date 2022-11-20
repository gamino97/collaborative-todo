import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  FormLabel,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { FormValues } from "constants/FormValues/CreateTask";

interface Props {
  onCreateTask: (data: FormValues) => Promise<void>;
}

function CreateTask({ onCreateTask }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  // const closeTaskCreation = () => {
  //   onClose();
  //   reset();
  // };
  useEffect(() => {
    const keyPressListener = (event: KeyboardEvent) => {
      if (event.key === "n" && event.altKey && !isOpen) {
        onOpen();
      }
    };
    window.addEventListener("keydown", keyPressListener);
    return () => window.removeEventListener("keydown", keyPressListener);
  }, [isOpen, onOpen]);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await onCreateTask(data);
    onClose();
  };
  return (
    <Box>
      <Button colorScheme="green" onClick={onOpen}>
        Create Task
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} onCloseComplete={reset}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Task Creation</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  id="title"
                  placeholder="Title"
                  {...register("title", { required: "Title is required" })}
                  autoFocus
                />

                <FormErrorMessage>
                  {errors.title != null && errors.title.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor="content">Content</FormLabel>
                <Textarea
                  id="content"
                  placeholder="Content"
                  {...register("content")}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter mt={4}>
              <Button colorScheme="blue" mr={3} isLoading={false} type="submit">
                Create Task
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export { CreateTask };
