import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import AuthLayout from "components/AuthLayout";
import Fallback from "components/Fallback";
import QueryError from "components/QueryError";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Navigate, useParams } from "react-router-dom";
import {
  requestResetPassword,
  resetPassword,
  useResetPasswordToken,
} from "services/user";

interface ForgotPasswordFields {
  newPassword: string;
}

function ResetPasswordToken() {
  const {
    register,
    formState: { errors, isSubmitting, isValidating },
    handleSubmit,
  } = useForm<ForgotPasswordFields>();
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const {
    data: isValidToken,
    isLoading,
    error,
  } = useResetPasswordToken({ token });
  const toast = useToast();
  useEffect(() => {
    const id = "reset-password-not-valid-toast";
    if (
      !toast.isActive(id) &&
      isValidToken &&
      typeof isValidToken.valid === "string"
    ) {
      toast({
        id,
        title: isValidToken.valid,
        status: "warning",
        duration: 2000,
        position: "top",
      });
    }
  }, [isValidToken, toast]);
  if (isLoading || !isValidToken) return <Fallback />;
  if (error instanceof Error) return <QueryError error={error} />;
  if (!isValidToken.valid) return <Navigate to="/login" replace={true} />;
  if (typeof isValidToken.valid === "string")
    return <Navigate to={"/login"} replace={true} />;
  const onSubmit: SubmitHandler<ForgotPasswordFields> = async (data) => {
    try {
      const response = await resetPassword({
        token: token || "",
        newPassword: data.newPassword,
      });
      setMessage(response.message);
    } catch (e) {
      interface Error {
        newPassword: string[];
      }
      const error = e as AxiosError<Error>;
      console.log(error.response?.data);
    }
  };

  return (
    <AuthLayout>
      <Heading>Reset password</Heading>
      <Box textAlign={"left"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mt={4}>
            <FormLabel htmlFor="newPassword">New Password</FormLabel>
            <Input
              id="newPassword"
              placeholder="Password"
              type="newPassword"
              {...register("newPassword", {
                required: "Password is required",
              })}
            />
            <FormErrorMessage>
              {errors.newPassword && errors.newPassword.message}
            </FormErrorMessage>
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
  );
}

export default ResetPasswordToken;
