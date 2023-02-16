import { Time, Track, BestTimeArr } from 'types';
import useSWR from 'swr';
import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import Spinner from './Spinner';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BestTimeTable() {
  const session = useSession();

  const { data: bestTimes, error: timesError } = useSWR<BestTimeArr[]>(
    `/api/bestTimes`,
    fetcher
  );

  if (timesError) return <div>failed to load</div>;
  if (!bestTimes) return <Spinner />;

  //with the logic from above create a grid with cards for each track and display the times for each track
  //also display 1,2,3 for the top 3 times
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {bestTimes.map((bestTimeObject) => (
        <div
          key={bestTimeObject.track.id}
          className="rounded-lg bg-gray-800 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              {bestTimeObject.track.name}
            </h1>
            <Image
              className="rounded-full"
              src={`/public/flags/${bestTimeObject.track.country}.png`}
              alt="flag"
              width={30}
              height={30}
            />
          </div>

          {bestTimeObject.times.map((time, index) => (
            <div key={time.id}>
              <p className="text-white">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {time.time} {'-'} {time.username}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
