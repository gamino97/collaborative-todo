export interface Team {
  name: string;
  id: number;
  uuid: string;
  created_at: string;
}

export interface CreateTeamData {
  data: Team;
}
