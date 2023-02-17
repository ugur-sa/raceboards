import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    //get all tracks
    const tracks = await prisma.tracks.findMany({
      orderBy: {
        season_order: 'asc',
      },
    });

    //get all times
    const times = await prisma.times.findMany();

    //get users
    const users = await prisma.users.findMany();

    //get the top 3 best times for each track and order them by time
    const bestTimes = tracks.map((track) => {
      const bestTimes = times
        .filter((time) => time.track_id === track.id)
        .sort((a, b) => a.time_in_ms - b.time_in_ms)
        .slice(0, 3);

      return {
        track: track,
        times: bestTimes.map((time) => ({
          id: time.id,
          time: time.time,
          updated_at: time.updated_at,
          username: users.find((user) => user.id === time.user_id)?.name,
        })),
      };
    });
    res.status(200).json(bestTimes);
  }
}
