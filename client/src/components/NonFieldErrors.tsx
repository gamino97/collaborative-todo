import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";
import { useState } from "react";

type NonFieldErrorsI = string[];

function useNonFieldErrors() {
  const [nonFieldErrors, setNonFieldErrors] = useState<NonFieldErrorsI>([]);
  return { nonFieldErrors, setNonFieldErrors };
}

interface Props {
  errors: NonFieldErrorsI;
}
function NonFieldErrors({ errors }: Props) {
  return (
    <>
      {errors.map((error, i) => {
        return (
          <Alert status="error" key={i}>
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        );
      })}
    </>
  );
}

export { useNonFieldErrors, NonFieldErrors };
