import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { track } = req.query;

    const trackFromDB = await prisma.tracks.findFirst({
      where: {
        query_name: track as string,
      },
    });

    //get all times for the track where valid_until is null
    const times = await prisma.times.findMany({
      where: {
        track_id: trackFromDB?.id,
        valid_until: null,
      },
      orderBy: {
        valid_until: 'asc',
      },
    });

    //get the username for each user and return it as well
    const tim = await Promise.all(
      times.map(async (time) => {
        const user = await prisma.users.findFirst({
          where: {
            id: time.user_id,
          },
        });
        return {
          ...time,
          username: user?.name,
        };
      })
    );

    //get delta for each time compared to the fastest time
    const timesWithDelta = await Promise.all(
      tim.map(async (time) => {
        const fastestTime = await prisma.times.findFirst({
          where: {
            track_id: time.track_id,
            valid_until: null,
          },
          orderBy: {
            time_in_ms: 'asc',
          },
        });
        return {
          ...time,
          delta: time.time_in_ms - (fastestTime?.time_in_ms || 0),
        };
      })
    );

    //order this list by delta
    timesWithDelta.sort((a, b) => a.delta - b.delta);

    res.status(200).json(timesWithDelta);
  }
}
