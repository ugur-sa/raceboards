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

export type ResultFromDB = {
  id: number;
  created_at: Date;
  type: string;
  result: ResultInformation;
  qualifying_id: number | null;
  practice_id: number | null;
  track_name: string;
};

export type ResultInformation = {
  TrackName: string;
  Type: string;
  RaceLaps: number;
  Cars: Car[];
  Laps: Lap[];
  Result: Result[];
  Events: Event[];
};

export type Result = {
  CarId: number;
  CarModel: string;
  DriverGuid: string;
  DriverName: string;
  TotalTime: number;
  BestLap: number;
};

export type Car = {
  CarId: number;
  Model: string;
  Skin: string;
  Driver: Driver;
};

export type Driver = {
  Guid: string;
  Name: string;
};

export type Lap = {
  CarId: number;
  CarModel: string;
  Cuts: number;
  DriverGuid: string;
  DriverName: string;
  LapTime: number;
  Sectors: number[];
  Timestamp: number;
  Tyre: string;
};

export type Event = {
  CarId: number;
  Driver: Driver;
  ImpactSpeed: number;
  OtherCarId: number;
  OtherDriver: Driver;
  Type: string;
};

export type DriverData = {
  driver: string;
  vehicle: string;
  laps: number;
  timestamp: [time: number, delta: number];
  bestLap: number;
  consistency: string;
  led: number;
  retired: boolean;
};

export type RaceResults = {
  type: string;
  track_name: string;
  driverData: DriverData[];
  winner: string;
  laps: number;
  best_lap: { driver: string; lapTime: number };
  led_most_laps: string;
};
