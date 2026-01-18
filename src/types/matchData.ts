export interface MatchAlliance {
  score: number;
  team_keys: string[];
  surrogate_team_keys: string[];
  dq_team_keys: string[];
}

export interface MatchData {
  key: string;
  comp_level: 'qm' | 'ef' | 'qf' | 'sf' | 'f';
  set_number: number;
  match_number: number;
  alliances: {
    red: MatchAlliance;
    blue: MatchAlliance;
  };
  winning_alliance: 'red' | 'blue' | '';
  event_key: string;
  time: number | null;
  actual_time: number | null;
  predicted_time: number | null;
  post_result_time: number | null;
  score_breakdown: any; // TODO: Define this type when it's documented by TBA
  videos: {
    type: string;
    key: string;
  }[];
}

