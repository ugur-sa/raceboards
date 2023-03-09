export type Track = {
  id: number;
  name: string;
  length: number;
  country: string;
  track_image: string;
  season_order: number;
  query_name: string;
  grand_prix_name: string;
  download_link: string;
};

export type Time = {
  id: number;
  time: string;
  track_id: number;
  user_name: string;
  user_id: string;
  time_in_ms: number;
  created_at: Date;
  updated_at: Date;
  valid_until: Date | null;
};

export type BestTimeArr = {
  track: Track;
  times: [
    {
      id: number;
      time: string;
      created_at: Date;
      username: string;
    }
  ];
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
};

export type FastestTime = {
  time: Time;
  user: User;
};

export type LeaderboardTime = {
  id: number;
  time: string;
  track_id: number;
  user_name: string;
  user_id: string;
  time_in_ms: number;
  created_at: Date;
  updated_at: Date;
  valid_until: Date | null;
  username: string;
  delta: number;
};

export type UserWithMedals = {
  id: string;
  name: string;
  avatar_url: string;
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;
};

export type TimeToDelete = {
  time: Time;
  track: Track;
};

export type Result = {
  track: string;
  number_of_sessions: number;
  players: Player[];
  sessions: Session[];
};

export type Player = {
  name: string;
  car: string;
  skin: string;
  points?: number;
};

export type Session = {
  event: number;
  name: string;
  type: number;
  lapsCount: number;
  duration: number;
  laps: Lap[];
  lapstotal: number[];
  bestLaps: BestLap[];
  raceResult: number[];
};

export type BestLap = {
  car: number;
  time: number;
  lap: number;
};

export type LapResponse = {
  Practice: [{ player: string; laps: Lap[] }];
  Qualification: [{ player: string; laps: Lap[] }];
  Race: [{ player: string; laps: Lap[] }];
};

export type Lap = {
  lap: number;
  car: number;
  sectors: [number, number, number];
  time: number;
  cuts: number;
  tyre: string;
  personal_best?: boolean;
  best_lap?: boolean;
  best_sector_1?: boolean;
  best_sector_2?: boolean;
  best_sector_3?: boolean;
  bad_lap?: boolean;
  pit?: boolean;
};

export type ResultResponse = {
  track_name: string;
  result: [Practice, Qualification, Race];
};

export type Race = {
  session?: string;
  winner?: string;
  most_laps_led?: string;
  best_lap?: {
    player: string;
    time: number;
  };
  max_laps?: number;
  lasted_laps?: number;
  results?: {
    player: string;
    vehicle: string;
    laps: number;
    time: {
      time: number;
      retired?: number;
    };
    best_lap: number;
    led: number;
  }[];
};

export type Qualification = {
  session?: string;
  pole?: {
    player: string;
    time: number;
  };
  max_minutes?: number;
  lasted_laps?: number;
  results?: {
    player: string;
    vehicle: string;
    laps: number;
    best_lap: number;
    gap: number;
  }[];
};

export type Practice = {
  session?: string;
  best_lap?: {
    player: string;
    time: number;
  };
  max_minutes?: number;
  lasted_laps?: number;
  results?: {
    player: string;
    vehicle: string;
    laps: number;
    best_lap: number;
    gap: number;
  }[];
};

export type UserTimes = {
  id: number;
  time_in_ms: number;
  time: string;
  track: string;
  created_at: Date;
};
