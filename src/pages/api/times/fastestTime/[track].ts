// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    //get the fastest time on the queried track
    const { track } = req.query;

    let trackString = track as string;

    const selectedTrack = await prisma.tracks.findFirst({
      where: {
        query_name: trackString,
      },
    });

    const fastestTime = await prisma.times.findFirst({
      where: {
        track_id: selectedTrack?.id,
      },
      orderBy: {
        time_in_ms: 'asc',
      },
    });

    if (fastestTime === null) {
      res.status(200).json({ time: null, user: null });
      return;
    }

    const user = await prisma.users.findFirst({
      where: {
        id: fastestTime?.user_id,
      },
    });

    res.status(200).json({ time: fastestTime, user: user });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
