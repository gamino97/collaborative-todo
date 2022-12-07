import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import TaskForm from "components/TaskForm";
import { FormValues } from "constants/FormValues/CreateTask";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  onCreateTask: (data: FormValues) => Promise<void>;
}

function CreateTask({ onCreateTask }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const methods = useForm<FormValues>();
  const {
    formState: { isSubmitting },
    reset,
  } = methods;
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
          <ModalBody>
            <TaskForm onSubmit={onSubmit} methods={methods}>
              <Flex my={4} justifyContent="end">
                <Button
                  colorScheme="blue"
                  mr={3}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Create Task
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </Flex>
            </TaskForm>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export { CreateTask };
