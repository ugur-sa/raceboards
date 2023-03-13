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

    const playerGaps = players.map((player, index) => {
      return {
        player: player.name,
        totalTime: [0],
        gaps: [] as number[],
      };
    });

    for (let i = 0; i < lapsCount; i++) {
      race.laps.forEach((lap) => {
        if (lap.lap === i) {
          playerGaps[lap.car].totalTime.push(
            lap.time + playerGaps[lap.car].totalTime[i]
          );
        }
      });
    }

    playerGaps.forEach((player, index) => {
      while (player.totalTime.length < lapsCount + 1) {
        player.totalTime.push(Infinity);
      }
    });

    let min: number[] = [];

    for (let i = 0; i < lapsCount; i++) {
      min.push(
        Math.min(...[...playerGaps].map((player) => player.totalTime[i]))
      );
    }

    playerGaps.forEach((player, index) => {
      player.totalTime.forEach((time, index) =>
        player.gaps.push(time - min[index])
      );
    });

    res.status(200).json({ playerGaps });
  }
}
