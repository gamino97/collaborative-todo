import { useQueryClient, useQuery } from "@tanstack/react-query";
import apiClient from "lib/apiClient";

interface Team {
  name: string;
}

interface CreateTeamData {
  data: Team;
}

async function createTeam({ data }: CreateTeamData): Promise<Team> {
  const response = await apiClient.post("/teams/create", { ...data });
  return response.data;
}

async function fetchTeam(): Promise<Team> {
  const response = await apiClient.get("/teams/myteam");
  return response.data;
}

function useTeam() {
  const queryClient = useQueryClient();
  const invalidateTeamQuery = () => {
    queryClient.invalidateQueries({ queryKey: ["team"] });
  };
  const query = useQuery({
    queryKey: ["team"],
    queryFn: fetchTeam,
    staleTime: Infinity,
  });
  return { ...query, invalidateTeamQuery };
}

export { createTeam, useTeam };
