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

    res.status(200).json(userTimes);
  }
}
