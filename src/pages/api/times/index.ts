// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query;

    //get the times where valid_until is null
    const times = await prisma.times.findMany({
      where: {
        user_id: id as string,
        valid_until: null,
      },
      orderBy: {
        Tracks: {
          season_order: 'asc',
        },
      },
    });
    res.status(200).json(times);
  } else if (req.method === 'POST') {
    const { track, user_id, time } = req.body;
    //Get track id from track name
    const trackFromDB = await prisma.tracks.findFirst({
      where: {
        name: track,
      },
    });

    const track_id = trackFromDB?.id;

    //check if time already exists
    const timeFromDB = await prisma.times.findFirst({
      where: {
        user_id: user_id,
        track_id: track_id,
      },
    });

    //convert the time from 1:23.456 to 83456
    const timeArray = time.split(':');
    const minutes = parseInt(timeArray[0]);
    const seconds = parseInt(timeArray[1].split('.')[0]);
    const milliseconds = parseInt(timeArray[1].split('.')[1]);
    const timeInMilliseconds = minutes * 60000 + seconds * 1000 + milliseconds;

    if (
      timeFromDB?.time === time &&
      timeFromDB?.track_id === track_id &&
      timeFromDB?.user_id === user_id
    ) {
      res.status(400).json({ message: 'Time already exists' });
      return;
    } else if (timeFromDB != null) {
      //add the valid_until field to the time and create a new time
      const updatedTime = await prisma.times.update({
        where: {
          id: timeFromDB?.id,
        },
        data: {
          valid_until: new Date(Date.now()),
        },
      });
      const newTime = await prisma.times.create({
        data: {
          time: time,
          user_id: user_id == undefined ? 0 : user_id,
          track_id: track_id == undefined ? 0 : track_id,
          time_in_ms: timeInMilliseconds,
        },
      });
      res.status(201).json({ newTime, updatedTime });
      return;
    }
    // Create new time
    const newTime = await prisma.times.create({
      data: {
        time: time,
        user_id: user_id == undefined ? 0 : user_id,
        track_id: track_id == undefined ? 0 : track_id,
        time_in_ms: timeInMilliseconds,
      },
    });

    res.status(201).json(newTime);
  } else if (req.method === 'DELETE') {
    const { id, track_id, user_id } = req.body;

    //get the time that is most recent after the deleted time and set valid_until to null
    const timeAfterDeletedTime = await prisma.times.findFirst({
      where: {
        track_id: track_id,
        user_id: user_id,
        valid_until: {
          lt: new Date(Date.now()),
        },
      },
      orderBy: {
        valid_until: 'desc',
      },
    });

    if (timeAfterDeletedTime) {
      const updatedTime = await prisma.times.update({
        where: {
          id: timeAfterDeletedTime?.id,
        },
        data: {
          valid_until: null,
        },
      });
      const deletedTime = await prisma.times.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json(deletedTime);
    } else {
      const deletedTime = await prisma.times.delete({
        where: {
          id: id,
        },
      });
      res.status(200).json(deletedTime);
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
