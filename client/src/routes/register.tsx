import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AxiosError, isAxiosError } from "axios";
import AuthLayout from "components/AuthLayout";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as ReachLink, useNavigate } from "react-router-dom";
import { RegisterData, registerUser } from "services/register";
import { useUser } from "services/user";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterData>();
  const navigate = useNavigate();
  const toast = useToast();
  const { invalidateUserQuery } = useUser();
  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    try {
      const res = await registerUser(data);
      invalidateUserQuery()
      toast({
        title: res.message,
        status: "success",
        duration: 2000,
        position: "top",
      });
      navigate("/demo/tasks");
    } catch (e) {
      console.error(e);
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
