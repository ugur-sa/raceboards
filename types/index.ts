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
  user_id: number;
  time_in_ms: number;
  updated_at: Date;
};

export type BestTimeArr = {
  track: Track;
  times: [
    {
      id: number;
      time: string;
      updated_at: Date;
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
