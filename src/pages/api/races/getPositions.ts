import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { PlayerGaps, Result } from 'types';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    //get query
    const { id } = req.query;

    const data = await prisma.results.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!data) {
      res.status(404).json({ message: 'No results found' });
      return;
    }

    const result: Result = data.result as Result;

    const lapsCount = result.sessions[result.sessions.length - 1].lapsCount;

    const players = result.players;

    const race = result.sessions[result.sessions.length - 1];

    const playerPositions = players.map((player, index) => {
      return {
        player: player.name,
        positions: [] as number[],
      };
    });

    res.status(200).json({ playerPositions });
  }
}
