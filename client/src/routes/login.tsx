import {
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Box,
  Link,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import apiClient from "lib/apiClient";
import AuthLayout from "components/AuthLayout";

interface FormValues {
  email: string;
  password: string;
}
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await apiClient.post("/auth/register", { ...data });
    console.log(res.data);
  };
  return (
    <AuthLayout>
      <Box textAlign="center">
        <Heading>Sign In to your Account</Heading>
      </Box>
      <Box my={8} textAlign="left" as="section">
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <FormControl mt={4}>
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
          <Stack isInline justifyContent="space-between" mt={4}>
            <Box>
              <Checkbox>Remember Me</Checkbox>
            </Box>
            <Box>
              <Link>Forgot your password?</Link>
            </Box>
          </Stack>
          <Button type="submit" w="full" mt={4} colorScheme="blue">
            Login
          </Button>
        </form>
      </Box>
    </AuthLayout>
  );
}
