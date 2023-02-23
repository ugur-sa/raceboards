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
  email: string;
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

export type Lap = {
  DriverName: string;
  DriverGuid: string;
  CarId: number;
  CarModel: string;
  Timestamp: number;
  LapTime: number;
  Sectors: [number, number, number];
  Cuts: number;
  Tyre: string;
};

export type Result = {
  DriverName: string;
  DriverGuid: string;
  CarId: number;
  CarModel: string;
  BestLap: number;
  TotalTime: number;
};

export type Car = {
  CarId: number;
  Driver: Driver;
  Model: string;
  Skin: string;
};

export type Driver = {
  Name: string;
  Guid: string;
};

export type Event = {
  Type: string;
  CarId: number;
  Driver: Driver;
  OtherCarId: number;
  OtherDriver: Driver;
  ImpactSpeed: number;
  WorldPosition: WorldPosition;
  RelPosition: RelPosition;
};

export type RelPosition = {
  X: number;
  Y: number;
  Z: number;
};

export type WorldPosition = {
  X: number;
  Y: number;
  Z: number;
};

export enum RaceType {
  RACE = 'RACE',
  QUALIFYING = 'QUALIFYING',
  PRACTICE = 'PRACTICE',
}
