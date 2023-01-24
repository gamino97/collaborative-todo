import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
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
import Fallback from "components/Fallback";
import NoTask from "components/NoTask";
import QueryError from "components/QueryError";
import TaskForm from "components/TaskForm";
import { TaskFormValues } from "constants/FormValues/CreateTask";
import { useTasks } from "hooks/tasks";
import { Mode, Task } from "lib/tasks/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { Team } from "services/types";

interface UpdateTaskProps {
  task: Task;
  mode: Mode;
}

function UpdateTask({ task, mode }: UpdateTaskProps) {
  const { handleUpdateTask } = useTasks(mode);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { title, description } = task;
  const methods = useForm<TaskFormValues>({
    defaultValues: { title, description },
  });
  const {
    formState: { isSubmitting },
    reset,
  } = methods;
  const onSubmit: SubmitHandler<TaskFormValues> = async (data) => {
    const updatedTask: Task = { ...task, ...data };
    await handleUpdateTask(updatedTask);
    onClose();
    reset({ title: updatedTask.title, description: updatedTask.description });
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
  mode: Mode;
  team?: Team;
}
export default function TaskList({ mode, team }: Props) {
  const { tasksQuery, handleDeleteTask, handleDoneTask } = useTasks(mode, team);
  const { isLoading, error, data: tasks } = tasksQuery;
  if (isLoading || !tasks) return <Fallback />;
  if (error instanceof Error) return <QueryError error={error} />;
  if (tasks.length === 0) {
    return <NoTask team={team} />;
  }
  return (
    <UnorderedList spacing={3} styleType="none" m={0}>
      {tasks.map((task) => {
        const handleDeleteClick = () => {
          return handleDeleteTask(task);
        };
        const handleCheckboxClick = () => handleDoneTask(task);
        return (
          <Flex
            as={ListItem}
            key={task.id}
            p={4}
            bg="whiteAlpha.50"
            alignItems="start"
            justifyContent="space-between"
            maxW="full"
          >
            <Center as="section" flexShrink="1">
              <Checkbox
                mr={2}
                isChecked={task.done}
                onChange={handleCheckboxClick}
              />
              <Box>
                <Heading size="md" as="h5" sx={{ hyphens: "auto" }}>
                  {task.title}
                </Heading>
                {task.description && (
                  <Text sx={{ hyphens: "auto" }}>{task.description}</Text>
                )}
              </Box>
            </Center>
            <Box as="section" flex="none">
              <UpdateTask task={task} mode={mode} />
              <IconButton
                colorScheme="red"
                aria-label={`Delete ${task.title}`}
                icon={<DeleteIcon />}
                onClick={handleDeleteClick}
              />
            </Box>
          </Flex>
        );
      })}
    </UnorderedList>
  );
}
