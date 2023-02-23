import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Car, Lap, RaceType, Result, Event } from 'types';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    //get the file from the request
    const file = req.body;

    if (!file) {
      res.status(400).json({ message: 'No file provided' });
      return;
    }
    const trackName: string = file['TrackName'];
    const type: RaceType = file['Type'];
    const raceLaps: number = file['RaceLaps'];
    const cars: Car[] = file['Cars'];
    const laps: Lap[] = file['Laps'];
    const results: Result[] = file['Result'];
    const events: Event[] = file['Events'];

    res.status(200).json({});
  } else {
    // only post allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
