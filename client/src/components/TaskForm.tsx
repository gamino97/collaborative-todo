import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { FormValues } from "constants/FormValues/CreateTask";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  onSubmit: SubmitHandler<FormValues>;
  methods: UseFormReturn<FormValues>;
  children: ReactNode;
  defaultValues?: FormValues;
}

function TaskForm({ onSubmit, children, methods }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={Boolean(errors.title)}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          id="title"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
          autoFocus
        />
        <FormErrorMessage>
          {errors.title && errors.title.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl mt={4} isInvalid={Boolean(errors.content)}>
        <FormLabel htmlFor="content">Content</FormLabel>
        <Textarea id="content" placeholder="Content" {...register("content")} />
        <FormErrorMessage>
          {errors.content && errors.content.message}
        </FormErrorMessage>
      </FormControl>
      {children}
    </form>
  );
}

export default TaskForm;
