import AuthLayout from "components/AuthLayout";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import apiClient from "lib/apiClient";
import { Link as ReachLink, redirect, useNavigate } from "react-router-dom";
import { AxiosError, isAxiosError } from "axios";

interface FormValues {
  email: string;
  password: string;
  name: string;
}

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await apiClient.post("/auth/register", { ...data });
      return navigate("/demo/tasks");
    } catch (e) {
      if (isAxiosError(e)) {
        const err = e as AxiosError;
        Object.entries(err.response.data).forEach(([field, message]) => {
          if (Array.isArray(message)) {
            message.forEach((m) => {
              setError(field, { type: "custom", message: m });
            });
          } else if (typeof message === "string") {
            setError(field, { type: "custom", message: message });
          }
        });
      }
    }
  };
  return (
    <AuthLayout>
      <Box textAlign="center">
        <Heading>Register a new Account</Heading>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} my={8} textAlign="left" as="section" width="full">
          <FormControl isInvalid={Boolean(errors.name)}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              placeholder="Name"
              {...register("name", { required: "The name is required" })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              placeholder="Email Address"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button type="submit" w="full" colorScheme="blue">
            Register
          </Button>
          <Text>
            Already a member?{" "}
            <Link as={ReachLink} color="teal.500" to="/login">
              Log in
            </Link>
          </Text>
        </VStack>
      </form>
    </AuthLayout>
  );
}

export default Register;
