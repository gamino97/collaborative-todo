import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "lib/apiClient";
import { CreateTeamData, Team } from "services/types";

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

interface LeaveTeam {
  teamId: number;
}

interface LeaveTeamResponse {
  message: string;
}
async function leaveTeam({ teamId }: LeaveTeam): Promise<LeaveTeamResponse> {
  const response = await apiClient.post(`/teams/${teamId}/leave`);
  return response.data;
}

export { createTeam, leaveTeam, useTeam };
