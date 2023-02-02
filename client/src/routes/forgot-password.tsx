import {
  Heading,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import AuthLayout from "components/AuthLayout";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { requestResetPassword } from "services/user";

interface ForgotPasswordFields {
  email: string;
}

function ForgotPassword() {
  const {
    register,
    formState: { errors, isSubmitting, isValidating },
    handleSubmit,
  } = useForm<ForgotPasswordFields>();
  const [message, setMessage] = useState("");
  const onSubmit: SubmitHandler<ForgotPasswordFields> = async (data) => {
    try {
      const response = await requestResetPassword({ email: data.email });
      setMessage(response.message);
    } catch (e) {
      interface Error {
        email: string[];
      }
      const error = e as AxiosError<Error>;
      console.log(error.response?.data.email);
    }
  };
  return (
    <>
      <AuthLayout>
        <Heading>Forgot your password?</Heading>
        <Box textAlign={"left"}>
          {message && (
            <Alert status="info">
              <AlertIcon />
              {message}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                placeholder="Email Address"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {!errors.email ? (
                <FormHelperText>
                  This must be the email address associated with your account.
                  If you have not changed this via your user control panel then
                  it is the email address you registered your account with.
                </FormHelperText>
              ) : (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              type="submit"
              w="full"
              mt={4}
              colorScheme="blue"
              isLoading={isSubmitting || isValidating}
            >
              Submit
            </Button>
          </form>
        </Box>
      </AuthLayout>
    </>
  );
}

export default ForgotPassword;
