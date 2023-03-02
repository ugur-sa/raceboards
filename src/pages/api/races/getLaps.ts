import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Lap, Result } from 'types';

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

    const result = results.result as Result;

    const raceLaps: any = [];
    const qualifyLaps: any = [];
    const practiceLaps: any = [];

    result.sessions.forEach((session) => {
      if (session.name === 'Practice') {
        result.players.forEach((player, index) => {
          practiceLaps.push({
            player: player.name,
            laps: session.laps.filter((lap) => lap.car === index),
          });
        });
      } else if (session.name === 'Qualification') {
        result.players.forEach((player, index) => {
          qualifyLaps.push({
            player: player.name,
            laps: session.laps.filter((lap) => lap.car === index),
          });
        });
      } else if (session.name === 'Race') {
        result.players.forEach((player, index) => {
          raceLaps.push({
            player: player.name,
            laps: session.laps.filter((lap) => lap.car === index),
          });
        });
      }
    });

    if (!(practiceLaps.length === 0)) {
    }
    if (!(qualifyLaps.length === 0)) {
      qualifyLaps.forEach((lapsObject: { player: string; laps: Lap[] }) => {
        lapsObject.laps
          .filter((lap) => lap.cuts === 0)
          .reduce((prev, curr) => {
            if (prev.time < curr.time) {
              return prev;
            } else {
              return curr;
            }
          }).personal_best = true;
      });

      const allLaps: Lap[] = [];
      qualifyLaps.forEach((lapsObject: { player: string; laps: Lap[] }) => {
        allLaps.push(...lapsObject.laps);
      });

      const best_lap: Lap = allLaps
        .filter((lap) => lap.cuts === 0)
        .reduce((prev, curr) => {
          if (prev.time < curr.time) {
            return prev;
          } else {
            return curr;
          }
        });

      qualifyLaps.forEach((lapsObject: { player: string; laps: Lap[] }) => {
        lapsObject.laps.forEach((lap) => {
          if (lap === best_lap) {
            lap.best_lap = true;
            lap.personal_best = false;
          }
        });
      });
      //TODO add bad lap indicator
      qualifyLaps.forEach((lapsObject: { player: string; laps: Lap[] }) => {
        lapsObject.laps.forEach((lap, index) => {
          // amount of laps with cuts > 0
          const amountOfCuts = lapsObject.laps.filter(
            (lap) => lap.cuts > 0
          ).length;

          // get the average time for a lap excluding the first one
          const averageTime =
            lapsObject.laps
              .filter((lap) => lap.cuts === 0)
              .reduce((prev, curr) => prev + curr.time, 0) /
            (lapsObject.laps.length - amountOfCuts);

          lapsObject.laps
            .filter((lap) => lap.cuts === 0)
            .forEach((lap) => {
              if (lap.time > averageTime * 1.07) {
                lap.bad_lap = true;
              }
            });
        });
      });

      const allSectors = allLaps
        .filter((lap) => lap.cuts === 0)
        .map((lap) => lap.sectors);

      const bestSector1 = allSectors.reduce((prev, curr) => {
        if (prev[0] < curr[0]) {
          return prev;
        } else {
          return curr;
        }
      })[0];
      const bestSector2 = allSectors.reduce((prev, curr) => {
        if (prev[1] < curr[1]) {
          return prev;
        } else {
          return curr;
        }
      })[1];
      const bestSector3 = allSectors.reduce((prev, curr) => {
        if (prev[2] < curr[2]) {
          return prev;
        } else {
          return curr;
        }
      })[2];

      const bestSectors = [bestSector1, bestSector2, bestSector3];

      bestSectors.forEach((sector, index) => {
        allLaps.forEach((lap) => {
          if (lap.sectors[index] === sector) {
            if (index === 0) {
              lap.best_sector_1 = true;
            } else if (index === 1) {
              lap.best_sector_2 = true;
            } else if (index === 2) {
              lap.best_sector_3 = true;
            }
          }
        });
      });
    }
    if (!(raceLaps.length === 0)) {
      raceLaps.forEach((lapsObject: { player: string; laps: Lap[] }) => {
        lapsObject.laps.reduce((prev, curr) => {
          if (prev.time < curr.time) {
            return prev;
          } else {
            return curr;
          }
        }).personal_best = true;
      });

      const allLaps: Lap[] = [];
      raceLaps.forEach((lapsObject: { player: string; laps: Lap[] }) => {
        allLaps.push(...lapsObject.laps);
      });

      const best_lap: Lap = allLaps.reduce((prev, curr) => {
        if (prev.time < curr.time) {
          return prev;
        } else {
          return curr;
        }
      });

      raceLaps.forEach((lapsObject: { player: string; laps: Lap[] }) => {
        lapsObject.laps.forEach((lap) => {
          if (lap === best_lap) {
            lap.best_lap = true;
            lap.personal_best = false;
          }
        });
      });

      raceLaps.forEach((lapsObject: { player: string; laps: Lap[] }) => {
        lapsObject.laps.forEach((lap, index) => {
          // get the average time for a lap excluding the first one
          const averageTime =
            lapsObject.laps
              .filter((lap) => lap.lap !== 1)
              .reduce((prev, curr) => prev + curr.time, 0) /
            (lapsObject.laps.length - 1);

          if (lap.time > averageTime * 1.07 && index > 0) {
            lap.bad_lap = true;
          }
        });
      });

      const allSectors = allLaps.map((lap) => lap.sectors);

      const bestSector1 = allSectors.reduce((prev, curr) => {
        if (prev[0] < curr[0]) {
          return prev;
        } else {
          return curr;
        }
      })[0];
      const bestSector2 = allSectors.reduce((prev, curr) => {
        if (prev[1] < curr[1]) {
          return prev;
        } else {
          return curr;
        }
      })[1];
      const bestSector3 = allSectors.reduce((prev, curr) => {
        if (prev[2] < curr[2]) {
          return prev;
        } else {
          return curr;
        }
      })[2];

      const bestSectors = [bestSector1, bestSector2, bestSector3];

      bestSectors.forEach((sector, index) => {
        allLaps.forEach((lap) => {
          if (lap.sectors[index] === sector) {
            if (index === 0) {
              lap.best_sector_1 = true;
            } else if (index === 1) {
              lap.best_sector_2 = true;
            } else if (index === 2) {
              lap.best_sector_3 = true;
            }
          }
        });
      });
    }

    res.status(200).json({
      Practice: practiceLaps,
      Qualification: qualifyLaps,
      Race: raceLaps,
    });
  }
}
