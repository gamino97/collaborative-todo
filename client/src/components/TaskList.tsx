import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { onDeleteTask, onUpdateTask, Task } from "lib/tasks/types";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import TaskForm from "components/TaskForm";
import { FormValues } from "constants/FormValues/CreateTask";

interface UpdateTaskProps {
  task: Task;
  onUpdateTask: onUpdateTask;
}

function UpdateTask({ task, onUpdateTask }: UpdateTaskProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const methods = useForm<FormValues>({
    defaultValues: { title: task.title, content: task.content },
  });
  const {
    formState: { isSubmitting },
    reset,
  } = methods;
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const updatedTask: Task = { ...task, ...data };
    await onUpdateTask(updatedTask);
    onClose();
  };
  return (
    <>
      <IconButton
        colorScheme="blue"
        aria-label={`Edit ${task.title}`}
        icon={<EditIcon />}
        onClick={onOpen}
        mr={4}
      />
      <Modal isOpen={isOpen} onClose={onClose} onCloseComplete={reset}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Update Task &quot;<Text as="i">{task.title}</Text>&quot;
          </ModalHeader>
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
                  Update Task
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </Flex>
            </TaskForm>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

interface Props {
  tasks: Task[];
  onDeleteTask: onDeleteTask;
  onUpdateTask: onUpdateTask;
}
export default function TaskList({ tasks, onDeleteTask, onUpdateTask }: Props) {
  return (
    <UnorderedList spacing={3} styleType="none" m={0}>
      {tasks.map((task) => {
        const handleDeleteClick = () => {
          return onDeleteTask(task);
        };
        return (
          <ListItem
            key={task.id}
            p={4}
            bg="gray.50"
            display="flex"
            alignItems="start"
            justifyContent="space-between"
          >
            <Box as="section">
              <Heading size="md" as="h5">
                {task.title}
              </Heading>
              {task.content && <Text>{task.content}</Text>}
            </Box>
            <Box as="section">
              <UpdateTask task={task} onUpdateTask={onUpdateTask} />
              <IconButton
                colorScheme="red"
                aria-label={`Delete ${task.title}`}
                icon={<DeleteIcon />}
                onClick={handleDeleteClick}
              />
            </Box>
          </ListItem>
        );
      })}
    </UnorderedList>
  );
}
