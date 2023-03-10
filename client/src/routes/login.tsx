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
  useToast,
} from "@chakra-ui/react";
import { AxiosError, isAxiosError } from "axios";
import AuthLayout from "components/AuthLayout";
import { NonFieldErrors, useNonFieldErrors } from "components/NonFieldErrors";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as ReachLink, useNavigate } from "react-router-dom";
import { LoginData, LoginResponse, loginUser, useUser } from "services/user";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<LoginData>();

  const { nonFieldErrors, setNonFieldErrors } = useNonFieldErrors();
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    setNonFieldErrors([]);
    try {
      const res = await loginUser(data);
      toast({
        title: "Logged in Successfully",
        status: "success",
        duration: 2000,
        position: "top",
      });
      setUser(res);
      navigate("/tasks");
    } catch (e) {
      console.error(e);
      if (isAxiosError(e)) {
        const responseError: AxiosError<LoginResponse> = e;
        const nonFieldErrors =
          responseError?.response?.data?.non_field_errors || [];
        setNonFieldErrors(nonFieldErrors);
      }
    }
  };

  return (
    <AuthLayout>
      <Box textAlign="center">
        <Heading>Sign In to your Account</Heading>
      </Box>
      <Box my={4} textAlign="left" as="section">
        <NonFieldErrors errors={nonFieldErrors} />
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
              <Checkbox id="remember_me" {...register("remember_me")}>
                Remember Me
              </Checkbox>
            </Box>
            <Box>
              <Link as={ReachLink} to="/forgot-password" color="teal.500">
                Forgot your password?
              </Link>
            </Box>
          </Stack>
          <Button
            type="submit"
            w="full"
            mt={4}
            colorScheme="blue"
            isLoading={isSubmitting || isValidating}
          >
            Login
          </Button>
        </form>
      </Box>
      <Text>
        Need an account?{" "}
        <Link as={ReachLink} to="/register" color="teal.500">
          Sign up
        </Link>
      </Text>
    </AuthLayout>
  );
}
