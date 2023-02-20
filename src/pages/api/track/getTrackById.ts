// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  let track_id = parseInt(id as string);

  const trackData = await prisma.tracks.findFirst({
    where: {
      id: track_id,
    },
  });
  res.status(200).json(trackData);
}
