// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Player, Result, Session } from 'types';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    //get the fastest time on the queried track
    const { season } = req.query;

    const seasonResults = await prisma.results.findMany({
      where: {
        season_year: Number(season),
      },
    });

    const racePoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

    const results: Result[] = seasonResults.map((result) => {
      return result.result as Result;
    });

    const allStandings: Player[] = [];

    results.forEach((result) => {
      const players = result.players;
      const race = result.sessions[result.sessions.length - 1];
      const raceResult = race.raceResult;

      const standings: Player[] = [];

      raceResult.forEach((car, index) => {
        if (players[car].name !== '') {
          const playerLaps = race.laps.filter((lap) => lap.car === car).length;
          if (playerLaps !== race.lapsCount) {
            players[car].points = 0;
            standings.push(players[car]);
          } else {
            players[car].points = racePoints[index];
            standings.push(players[car]);
          }
        }
      });

      standings.forEach((player) => {
        const fastestLap = race.bestLaps.reduce((prev, current) =>
          prev.time < current.time ? prev : current
        );

        if (
          player.name === players[fastestLap.car].name &&
          player.points! > 0
        ) {
          player.points! += 1;
        }
      });

      standings.forEach((player) => {
        allStandings.push(player);
      });
    });

    //combine all the points for each player in allStandings and return a new array with the players sorted by points
    const standings = allStandings
      .flat()
      .reduce((acc: Player[], player: Player) => {
        const existingPlayer = acc.find((p) => p.name === player.name);
        if (existingPlayer) {
          existingPlayer.points! += player.points!;
          return acc;
        } else {
          return [...acc, player];
        }
      }, [])
      .sort((a, b) => b.points! - a.points!);

    res.status(200).json({ standings });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
