import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { UserWithMedals } from 'types';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    //get all users
    const users = await prisma.users.findMany();

    //for each user get the amount of fastest, second fastest and third fastest times on each track and return gold, silver and bronze medals
    const usersWithMedals = await Promise.all(
      users.map(async (user) => {
        const times = await prisma.times.findMany({
          where: {
            user_id: user.id,
          },
          select: {
            id: true,
            track_id: true,
          },
        });

        const medals = await Promise.all(
          times.map(async (time) => {
            const fastestTimes = await prisma.times.findMany({
              where: {
                track_id: time.track_id,
                valid_until: null,
              },
              orderBy: {
                time_in_ms: 'asc',
              },
              take: 3,
            });

            if (fastestTimes[0]?.id === time.id) {
              return 1 as number;
            } else if (fastestTimes[1]?.id === time.id) {
              return 2 as number;
            } else if (fastestTimes[2]?.id === time.id) {
              return 3 as number;
            } else {
              return 0 as number;
            }
          })
        );

        const goldMedals = medals.filter((medal) => medal === 1).length;
        const silverMedals = medals.filter((medal) => medal === 2).length;
        const bronzeMedals = medals.filter((medal) => medal === 3).length;

        return {
          ...user,
          goldMedals,
          silverMedals,
          bronzeMedals,
        };
      })
    );

    //if users have the same amount of silver medals, order them by the amount of bronze medals
    usersWithMedals.sort((a, b) => b.bronzeMedals - a.bronzeMedals);

    //if users have the same amount of gold medals, order them by the amount of silver medals
    usersWithMedals.sort((a, b) => b.silverMedals - a.silverMedals);

    //also order them by the amount of gold medals
    usersWithMedals.sort((a, b) => b.goldMedals - a.goldMedals);

    const response = usersWithMedals.map((user) => {
      return {
        id: user.id,
        name: user.name,
        goldMedals: user.goldMedals,
        silverMedals: user.silverMedals,
        bronzeMedals: user.bronzeMedals,
      };
    });

    res.status(200).json(response);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
