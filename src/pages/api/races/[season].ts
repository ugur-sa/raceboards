import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { season } = req.query;

    const results = await prisma.results.findMany({
      where: {
        season_year: Number(season),
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    res.status(200).json(results);
  }
}
