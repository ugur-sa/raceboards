// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { track } = req.query;

  let trackString = track as string;

  const trackData = await prisma.tracks.findFirst({
    where: {
      query_name: trackString,
    },
  });
  res.status(200).json(trackData);
}
