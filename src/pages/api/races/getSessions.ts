import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Result } from 'types';

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

    let sessions: string[] = [];

    const result = results?.result as Result;

    result.sessions.forEach((session) => {
      sessions.push(session.name);
    });

    res.status(200).json(sessions);
  }
}
