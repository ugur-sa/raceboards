import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
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

    // const type = file['Type'];
    const track_name = file['track'];

    try {
      const newResult = await prisma.results.create({
        data: {
          track_name: track_name,
          result: file,
        },
      });
      res.status(200).json({ message: 'File uploaded' });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } else {
    // only post allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
