import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
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
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { resetPassword, useResetPasswordToken } from "services/user";

interface ForgotPasswordFields {
  newPassword: string;
}

function ResetPasswordToken() {
  const {
    register,
    formState: { errors, isSubmitting, isValidating },
    handleSubmit,
    setError,
  } = useForm<ForgotPasswordFields>();
  const { token } = useParams();
  const [message, setMessage] = useState("");
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
  const navigate = useNavigate();
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
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        position: "top",
      });
      navigate("/login");
    } catch (e) {
      interface Error {
        new_password?: string[];
        message?: false | string;
      }
      const error = e as AxiosError<Error>;
      const data = error.response?.data;
      console.error(error);
      if (data) {
        if (data.new_password) {
          setError("newPassword", {
            type: "manual",
            message: data.new_password[0],
          });
        }
        if (typeof data.message === "string") {
          setMessage(data.message);
        }
        if (typeof data.message === "boolean") {
          navigate("/");
        }
      }
    }
  };

  return (
    <AuthLayout>
      <Heading>Reset password</Heading>
      <Box textAlign={"left"}>
        {message && (
          <Alert status="info">
            <AlertIcon />
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mt={4} isInvalid={errors.newPassword}>
            <FormLabel htmlFor="newPassword">New Password</FormLabel>
            <Input
              id="newPassword"
              placeholder="Password"
              type="password"
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
