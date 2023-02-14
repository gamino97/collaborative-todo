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
  const { setUser } = useUser();
  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    try {
      const res = await registerUser(data);
      setUser(res);
      toast({
        title: `User ${res.name} registered successfully`,
        status: "success",
        duration: 2000,
        position: "top",
      });
      navigate("/tasks");
    } catch (e) {
      console.error(e);
      if (isAxiosError(e)) {
        const err = e as AxiosError<{
          message: string;
          detail: Record<string, Record<keyof Partial<RegisterData>, string[]>>;
        }>;
        if (err.response) {
          if (err.response.status === 400) {
            return toast({ title: err.response.data.message });
          }
          Object.entries(err.response.data.detail["json"]).forEach(
            ([field, message]) => {
              message.forEach((m) => {
                // @ts-expect-error This should be the same type as RegisterData
                setError(field, { type: "custom", message: m });
              });
            }
          );
        }
      }
    }
  };

  return (
    <AuthLayout>
      <Box textAlign="center">
        <Heading>Register a new Account</Heading>
      </Box>
      <Box my={4} textAlign="left" as="section">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={Boolean(errors.name)} mt={4}>
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
          <FormControl isInvalid={Boolean(errors.email)} mt={4}>
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
          <Button mt={4} type="submit" w="full" colorScheme="blue">
            Register
          </Button>
        </form>
      </Box>
      <Text>
        Already a member?{" "}
        <Link as={ReachLink} color="teal.500" to="/login">
          Log in
        </Link>
      </Text>
    </AuthLayout>
  );
}

export default Register;
