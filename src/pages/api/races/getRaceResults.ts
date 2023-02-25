import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { DriverData, Lap, ResultInformation } from 'types';

interface LapData {
  driver: string;
  lapTime: number;
}

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (id === undefined) {
      res.status(400).json({ message: 'No id provided' });
      return;
    }

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

    //remove all laps where DriverName is undefined
    for (let i = 0; i < result.Laps.length; i++) {
      if (result.Laps[i].DriverName === '') {
        result.Laps.splice(i, 1);
        i--;
      }
    }

    //remove all cars where DriverName is undefined
    for (let i = 0; i < result.Cars.length; i++) {
      if (result.Cars[i].Driver.Name === '') {
        result.Cars.splice(i, 1);
        i--;
      }
    }

    //remove all results where DriverName is undefined
    for (let i = 0; i < result.Result.length; i++) {
      if (result.Result[i].DriverName === '') {
        result.Result.splice(i, 1);
        i--;
      }
    }

    const type = result.Type;
    const track_name = result.TrackName;

    //amount of drivers
    const drivers = result.Result.length;

    //amount of laps
    const lapAmount = result.RaceLaps;

    //get the winner
    const winner = result.Result[0].DriverName;

    const laps: LapData[] = result.Laps.map((lap) => {
      return {
        driver: lap.DriverName,
        lapTime: lap.LapTime,
      };
    });

    //create an array of driver data where all the data from above is stored
    const driverData: DriverData[] = [];
    for (let i = 0; i < drivers; i++) {
      driverData.push({
        driver: result.Result[i].DriverName,
        bestLap: 0,
        consistency: '',
        laps: 0,
        timestamp: [0, 0],
        vehicle: '',
        led: 0,
        retired: false,
      });
    }

    //vehile name
    driverData.forEach((driver) => {
      result.Cars.forEach((car) => {
        if (car.Driver.Name === driver.driver) {
          driver.vehicle = car.Model;
        }
      });
    });

    //how many laps did each driver finish
    driverData.forEach((driver) => {
      driver.laps = 0;
      for (let i = 0; i < result.Laps.length; i++) {
        if (result.Laps[i].DriverName === driver.driver) {
          driver.laps += 1;
        }
      }
    });

    //total time of each driver
    driverData.forEach((driver) => {
      if (driver.timestamp === undefined) return;
      driver.timestamp[0] = 0;
      for (let i = 0; i < result.Result.length; i++) {
        if (result.Result[i].DriverName === driver.driver) {
          driver.timestamp[0] += result.Result[i].TotalTime;
        }
      }
    });

    //get the time difference between the winner and the driver
    driverData.forEach((driver) => {
      if (driver.timestamp === undefined) return;
      driver.timestamp[1] = driver.timestamp[0] - result.Result[0].TotalTime;
    });

    //laps can be seen in arrays of how many drivers there are. Lets say its 3 drivers
    //if every driver lasted 10 laps we have 30 laps in the laps array
    //they are ordered by position. Because we have 3 drivers you can divide the laps array by 3
    //each sliced array consists of 3 laps 1 for each driver and the order of that array tells you what position those drivers where in that lap
    //so if driver1 is in position 0 in the array they led that lap

    //get the driver that led most laps
    const ledMostLapsDriver: { [key: string]: number } = {};
    for (let j = 0; j < result.Result.length; j++) {
      ledMostLapsDriver[result.Laps[j].DriverName] = 0;
    }
    for (let i = 0; i < result.Laps.length; i += drivers) {
      ledMostLapsDriver[result.Laps[i].DriverName] += 1;
    }

    //order ledMostLapsDriver by the count and create an object again
    const ledMostLapsDriverOrdered = Object.entries(ledMostLapsDriver)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    //get the first key of the object and set it as the ledMostLapsDriver
    let ledMostLapsDriverName = '';
    Object.entries(ledMostLapsDriverOrdered).forEach(([key, value]) => {
      //if the value is duplicate then return the key of the driver that has the highest position
      if (value === Object.values(ledMostLapsDriverOrdered)[1]) {
        const driver1 = Object.keys(ledMostLapsDriverOrdered)[0];
        const driver2 = Object.keys(ledMostLapsDriverOrdered)[1];
        const driver1Position = result.Result.findIndex(
          (driver) => driver.DriverName === driver1
        );
        const driver2Position = result.Result.findIndex(
          (driver) => driver.DriverName === driver2
        );
        if (driver1Position < driver2Position) {
          ledMostLapsDriverName = driver1;
        } else {
          ledMostLapsDriverName = driver2;
        }
      }
    });

    Object.entries(ledMostLapsDriverOrdered).forEach(([key, value]) => {
      driverData.forEach((driver) => {
        if (driver.driver === key) {
          driver.led = value as number;
        }
      });
    });

    //get the best lap
    const bestLap = laps.reduce((prev, current) => {
      return prev.lapTime < current.lapTime ? prev : current;
    });

    // calculate the consistency of the drivers by their lap times and how close the lap times were to each other
    // the closer the lap times are to each other the more consistent the driver is
    // the more consistent the driver is the higher the consistency score

    //get the lap times of each driver
    const driverLapTimes: { [key: string]: number[] } = {};
    for (let j = 0; j < result.Result.length; j++) {
      driverLapTimes[result.Laps[j].DriverName] = [];
    }
    for (let i = 1; i < result.Laps.length; i++) {
      //get the average of the times
      if (driverLapTimes[result.Laps[i].DriverName] === undefined) {
        return;
      } else {
        driverLapTimes[result.Laps[i].DriverName].push(result.Laps[i].LapTime);
      }
    }

    //calculate the consistency of each driver in percentage so you have like billy: 90.50%
    const driverConsistency: { [key: string]: string } = {};
    for (const driver in driverLapTimes) {
      const consistency =
        1 -
        standardDeviation(driverLapTimes[driver]) /
          average(driverLapTimes[driver]);
      //write the std in driverConsisitency
      driverConsistency[driver] = (consistency * 100).toFixed(2);
    }

    //get the best lap for each driver
    const driverBestLap: { [key: string]: number } = {};

    for (let j = 0; j < result.Result.length; j++) {
      driverBestLap[result.Laps[j].DriverName] = 0;
    }

    for (let i = 0; i < result.Laps.length; i++) {
      if (driverBestLap[result.Laps[i].DriverName] === 0) {
        driverBestLap[result.Laps[i].DriverName] = result.Laps[i].LapTime;
      } else if (
        driverBestLap[result.Laps[i].DriverName] > result.Laps[i].LapTime
      ) {
        driverBestLap[result.Laps[i].DriverName] = result.Laps[i].LapTime;
      }
    }

    Object.entries(driverBestLap).forEach(([key, value]) => {
      driverData.forEach((driver) => {
        if (driver.driver === key) {
          driver.bestLap = value as number;
        }
      });
    });

    Object.entries(driverConsistency).forEach(([key, value]) => {
      driverData.forEach((driver) => {
        if (driver.driver === key) {
          driver.consistency = value as string;
        }
      });
    });

    driverData.forEach((driver) => {
      if (lapAmount > driver.laps) {
        driver.retired = true;
      }
    });

    const raceResults = {
      type: type,
      track_name: track_name,
      winner: winner,
      led_most_laps: ledMostLapsDriverName,
      best_lap: bestLap,
      laps: lapAmount,
      driverData: driverData,
    };

    res.status(200).json(raceResults);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const standardDeviation = (values: number[]) => {
  if (values.length <= 1) return 0;
  //remove the first value
  values.shift();

  const avg = average(values);

  const squareDiffs = values.map((value) => {
    const diff = value - avg;
    return diff * diff;
  });

  const avgSquareDiff = average(squareDiffs);

  return Math.sqrt(avgSquareDiff);
};

const average = (values: number[]) => {
  return values.reduce((a, b) => a + b, 0) / values.length;
};
