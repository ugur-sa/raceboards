import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import {
  Lap,
  Player,
  Practice,
  Qualification,
  Race,
  Result,
  Session,
} from 'types';

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

    const track_name: string = results.track_name!;
    const result: Result = results.result as Result;

    const practice: Practice = {};
    const qualification: Qualification = {};
    const race: Race = {};

    result.sessions.forEach((session: Session) => {
      if (session.name === 'Practice') {
        practice.session = session.name;
        practice.best_lap = {
          player:
            result.players[
              session.bestLaps.reduce((prev, curr) =>
                prev.time < curr.time ? prev : curr
              ).car
            ].name,
          time: session.bestLaps.reduce((prev, curr) =>
            prev.time < curr.time ? prev : curr
          ).time,
        };
        practice.max_minutes = session.duration;

        const lastedLaps = Math.max(
          ...session.bestLaps.map((bestLap, index) => {
            return session.laps.filter((lap) => lap.car === index).length;
          })
        );

        practice.lasted_laps = lastedLaps;
        practice.results = [];

        if (session.bestLaps.length < result.players.length) {
          result.players.forEach((player: Player, index: number) => {
            if (!session.bestLaps.find((bestLap) => bestLap.car === index)) {
              session.bestLaps.push({
                car: index,
                time: Infinity,
                lap: Infinity,
              });
            }
          });
        }
        session.bestLaps.forEach((bestLap, index) => {
          practice.results?.push({
            player: result.players[bestLap.car].name,
            vehicle: result.players[bestLap.car].car,
            laps: session.laps.filter((lap) => lap.car === bestLap.car).length,
            best_lap: bestLap.time,
            gap: bestLap.time - practice.best_lap?.time!,
          });
        });

        //sort qualification results by best lap
        practice.results.sort((a, b) => a.best_lap - b.best_lap);
      } else if (session.name === 'Qualification') {
        qualification.session = session.name;
        qualification.pole = {
          player:
            result.players[
              session.bestLaps.reduce((prev, curr) =>
                prev.time < curr.time ? prev : curr
              ).car
            ].name,
          time: session.bestLaps.reduce((prev, curr) =>
            prev.time < curr.time ? prev : curr
          ).time,
        };
        qualification.max_minutes = session.duration;

        const lastedLaps = Math.max(
          ...session.bestLaps.map((bestLap, index) => {
            return session.laps.filter((lap) => lap.car === index).length;
          })
        );

        qualification.lasted_laps = lastedLaps;
        qualification.results = [];

        if (session.bestLaps.length < result.players.length) {
          result.players.forEach((player: Player, index: number) => {
            if (!session.bestLaps.find((bestLap) => bestLap.car === index)) {
              session.bestLaps.push({
                car: index,
                time: Infinity,
                lap: Infinity,
              });
            }
          });
        }

        session.bestLaps.forEach((bestLap, index) => {
          qualification.results?.push({
            player: result.players[bestLap.car].name,
            vehicle: result.players[bestLap.car].car,
            laps: session.laps.filter((lap) => lap.car === bestLap.car).length,
            best_lap: bestLap.time,
            gap: bestLap.time - qualification.pole?.time!,
          });
        });

        //sort qualification results by best lap
        qualification.results.sort((a, b) => a.best_lap - b.best_lap);
      } else if (session.name === 'Race') {
        const unfixedLaps = session.laps;
        if (session.laps.length !== session.lapsCount * result.players.length) {
          session.laps = fixLaps(
            session.laps,
            session.lapsCount,
            result.players
          );
        }
        race.session = session.name;
        race.winner = result.players[session.raceResult[0]].name;
        race.best_lap = {
          player:
            result.players[
              session.bestLaps.reduce((prev, curr) =>
                prev.time < curr.time ? prev : curr
              ).car
            ].name,
          time: session.bestLaps.reduce((prev, curr) =>
            prev.time < curr.time ? prev : curr
          ).time,
        };
        race.max_laps = session.lapsCount;
        race.lasted_laps = Math.max(...session.lapstotal);
        race.results = [];

        if (session.bestLaps.length < result.players.length) {
          result.players.forEach((player: Player, index: number) => {
            if (!session.bestLaps.find((bestLap) => bestLap.car === index)) {
              session.bestLaps.push({
                car: index,
                time: Infinity,
                lap: Infinity,
              });
            }
          });
        }

        session.raceResult.forEach((index) => {
          race.results?.push({
            player: result.players[index].name,
            vehicle: result.players[index].car,
            laps: session.lapstotal[index],
            time: getTime(unfixedLaps, index, session.lapsCount),
            best_lap: session.bestLaps[index].time,
            led: getLedLapsAmount(
              session.laps,
              result.players,
              session.lapsCount,
              index
            ),
          });
        });
        //get the player with most laps led
        race.most_laps_led = race.results.reduce((prev, curr) =>
          prev.led > curr.led ? prev : curr
        ).player;
      }
    });

    const response = {
      track_name: track_name,
      result: [practice, qualification, race],
    };

    res.status(200).json(response);
  }
}

function getTime(
  laps: Lap[],
  player: number,
  lapsCount: number
): { time: number; retired?: number } {
  const playerLaps: Lap[] = [];

  laps.forEach((lap) => {
    if (lap.car === player) {
      playerLaps.push(lap);
    }
  });

  if (playerLaps.length === 0) return { time: 0 };

  let time = 0;

  playerLaps.forEach((lap) => {
    if (lap.time === Infinity) return;
    time += lap.time;
  });

  if (playerLaps.length != lapsCount) {
    return { time: time, retired: lapsCount - playerLaps.length };
  } else if (playerLaps.length < Math.floor(lapsCount * 0.9)) {
    return { time: time, retired: -1 };
  }

  return { time: time };
}

function getLedLapsAmount(
  laps: Lap[],
  players: Player[],
  lapsCount: number,
  player: number
) {
  const playerObjects = players.map((player: Player, index) => {
    return { index: index, led: 0, time: 0 };
  });

  let count = 0;

  for (let i = 0; i < lapsCount; i++) {
    for (let j = 0; j < laps.length; j++) {
      if (laps[j].lap === i) {
        playerObjects[laps[j].car].time += laps[j].time;
        count++;
        if (count >= players.length && count % players.length === 0) {
          playerObjects.reduce((prev, curr) => {
            return prev.time < curr.time ? prev : curr;
          }).led++;
        }
      }
    }
  }
  return playerObjects[player].led;
}

function fixLaps(laps: Lap[], lapsCount: number, players: Player[]): Lap[] {
  if (laps.length === lapsCount * players.length) return laps;

  const allPlayerLaps = players.map((player, index) => {
    const playerLaps: Lap[] = [];

    laps.forEach((lap) => {
      if (lap.car === index) {
        playerLaps.push(lap);
      }
    });

    while (playerLaps.length < lapsCount) {
      playerLaps.push({
        lap: playerLaps.length,
        car: index,
        sectors: [0, 0, 0],
        time: Infinity,
        cuts: 0,
        tyre: '',
      });
    }

    return playerLaps;
  });

  let fixedLaps: Lap[] = [];

  allPlayerLaps.forEach((playerLaps) => {
    playerLaps.forEach((lap) => {
      fixedLaps.push(lap);
    });
  });

  return fixedLaps;
}
