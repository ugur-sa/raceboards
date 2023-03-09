import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id, track } = req.query;

    const userTimes = await prisma.times.findMany({
      where: {
        user_id: id as string,
        track_id: Number(track),
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const t = await prisma.tracks.findUnique({
      where: {
        id: Number(track),
      },
    });

    const response = userTimes.map((time) => {
      return {
        id: time.id,
        time: time.time,
        time_in_ms: time.time_in_ms,
        track: t?.name,
        created_at: time.created_at,
      };
    });

    res.status(200).json(response);
  }
}
