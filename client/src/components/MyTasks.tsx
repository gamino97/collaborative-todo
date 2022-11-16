import {
  Box,
  Button,
  Center,
  Heading,
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
  Kbd,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import TaskList from "./TaskList";

const NoTask = () => {
  return (
    <>
      <Center>
        <img src="/no-task.png" alt="No task" />
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

interface FormValues {
  title: string;
  content: string;
}

function CreateTask() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const closeTaskCreation = () => {
    onClose();
    reset();
  };
  useEffect(() => {
    const keyPressListener = (event: KeyboardEvent) => {
      if (event.key === "n" && event.altKey && !isOpen) {
        onOpen();
      }
    };
    window.addEventListener("keydown", keyPressListener);
    return () => window.removeEventListener("keydown", keyPressListener);
  }, [isOpen, onOpen]);
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    return console.log(data);
  };
  return (
    <Box>
      <Button colorScheme="green" onClick={onOpen}>
        Create Task
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
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
              <Button variant="ghost" onClick={closeTaskCreation}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function getTasks() {
  return [];
}

function MyTasks() {
  const tasks = getTasks();
  return (
    <Box>
      <CreateTask />
      <Box mt={4}>
        {tasks.length === 0 ? <NoTask /> : <TaskList tasks={tasks} />}
      </Box>
    </Box>
  );
}

export default MyTasks;
