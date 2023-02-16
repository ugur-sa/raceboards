export type Track = {
  id: number;
  name: string;
  length: number;
  country: string;
  track_image: string;
  season_order: number;
};

export type Time = {
  id: number;
  time: string;
  track_id: number;
  user_name: string;
  user_id: number;
};

export type BestTimeArr = {
  track: string;
  times: [
    {
      id: number;
      time: string;
      username: string;
    }
  ];
};
