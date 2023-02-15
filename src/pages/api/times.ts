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

    const times = await prisma.times.findMany({
      where: {
        user_id: id as string,
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

    if (timeFromDB != null) {
      // Update time
      const updatedTime = await prisma.times.update({
        where: {
          id: timeFromDB?.id,
        },
        data: {
          time: time,
        },
      });
      res.status(201).json(updatedTime);
    } else {
      // Create new time
      const newTime = await prisma.times.create({
        data: {
          time: time,
          user_id: user_id == undefined ? 0 : user_id,
          track_id: track_id == undefined ? 0 : track_id,
        },
      });

      res.status(201).json(newTime);
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
