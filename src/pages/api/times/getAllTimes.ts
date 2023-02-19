import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id, track } = req.query;

    if (track === undefined) {
      const times = await prisma.times.findMany({
        where: {
          user_id: id as string,
        },
        orderBy: {
          valid_until: 'asc',
        },
      });
      res.status(200).json(times);
      return;
    }

    const trackFromDB = await prisma.tracks.findFirst({
      where: {
        query_name: track as string,
      },
    });

    if (trackFromDB != null) {
      const times = await prisma.times.findMany({
        where: {
          user_id: id as string,
          track_id: trackFromDB?.id,
        },
        orderBy: {
          valid_until: 'asc',
        },
      });
      res.status(200).json(times);
    }
  }
}
