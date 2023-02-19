export type Track = {
  id: number;
  name: string;
  length: number;
  country: string;
  track_image: string;
  season_order: number;
  query_name: string;
  grand_prix_name: string;
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
