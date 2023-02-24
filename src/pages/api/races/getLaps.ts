import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ResultInformation } from 'types';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    //get query
    const { id } = req.query;

    const results = await prisma.results.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!results) {
      res.status(404).json({ message: 'No results found' });
      return;
    }

    const result = results.result as ResultInformation;
    const laps = result.Laps;

    res.status(200).json(laps);
  }
}
