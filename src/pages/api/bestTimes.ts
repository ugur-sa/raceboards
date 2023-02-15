import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    //get all tracks
    const tracks = await prisma.tracks.findMany();

    //get all times
    const times = await prisma.times.findMany();

    //get users
    const users = await prisma.users.findMany();

    //get the best time for each track but the times are saved as strings
    //so we need to convert them to numbers but they are in this format "1:23.456"
    //so we need to split the string and convert the numbers to milliseconds to check which is the best time and then convert it back to the string format
    // const bestTimes = tracks.map((track) => {
    //   const bestTime = times
    //     .filter((time) => time.track_id === track.id)
    //     .sort((a, b) => {
    //       const aTime = a.time.split(':');
    //       const bTime = b.time.split(':');

    //       const aTimeInMs =
    //         parseInt(aTime[0]) * 60 * 1000 + parseInt(aTime[1]) * 1000;
    //       const bTimeInMs =
    //         parseInt(bTime[0]) * 60 * 1000 + parseInt(bTime[1]) * 1000;

    //       return aTimeInMs - bTimeInMs;
    //     })[0];

    //   return {
    //     track_id: track.id,
    //     time: bestTime?.time,
    //     username: users.find((user) => user.id === bestTime?.user_id)?.name,
    //   };
    // });
    // res.status(200).json(bestTimes);

    //get the top 3 best times for each track and order them by time
    const bestTimes = tracks.map((track) => {
      const bestTimes = times
        .filter((time) => time.track_id === track.id)
        .sort((a, b) => {
          const aTime = a.time.split(':');
          const bTime = b.time.split(':');

          const aTimeInMs =
            parseInt(aTime[0]) * 60 * 1000 + parseInt(aTime[1]) * 1000;
          const bTimeInMs =
            parseInt(bTime[0]) * 60 * 1000 + parseInt(bTime[1]) * 1000;

          return aTimeInMs - bTimeInMs;
        })
        .slice(0, 3);

      return {
        track: track.name,
        times: bestTimes.map((time) => ({
          id: time.id,
          time: time.time,
          username: users.find((user) => user.id === time.user_id)?.name,
        })),
      };
    });
    res.status(200).json(bestTimes);
  }
}
