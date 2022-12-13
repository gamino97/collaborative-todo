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
import { Mode } from "lib/tasks/types";
import { TaskFormValues } from "constants/FormValues/CreateTask";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTasks } from "hooks/tasks";

interface Props {
  mode: Mode;
}

function CreateTask({ mode }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const methods = useForm<TaskFormValues>();
  const {
    formState: { isSubmitting },
    reset,
  } = methods;
  const { handleCreateTask } = useTasks(mode);
  useEffect(() => {
    const keyPressListener = (event: KeyboardEvent) => {
      if (event.key === "n" && event.altKey && !isOpen) {
        onOpen();
      }
    };
    window.addEventListener("keydown", keyPressListener);
    return () => window.removeEventListener("keydown", keyPressListener);
  }, [isOpen, onOpen]);
  const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    try {
      await handleCreateTask(data);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Box as="section">
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
