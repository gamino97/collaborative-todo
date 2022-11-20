import { Stack, Skeleton } from "@chakra-ui/react";

export default function Fallback() {
  return (
    <Stack m={40}>
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  );
}
