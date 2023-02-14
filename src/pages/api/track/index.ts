// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      const tracks = await prisma.tracks.findMany();
      res.status(200).json(tracks);
      break;
    case 'POST':
      const { name, length, country, track_image } = req.body;
      const track = await prisma.tracks.create({
        data: {
          name: name,
          length: length,
          country: country,
          track_image: track_image,
        },
      });
      res.status(201).json(track);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
