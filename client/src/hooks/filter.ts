import { useSearchParams } from "react-router-dom";

export function useSearchTask(): string {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  return q;
}
