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

  const loadingArray = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22,
  ];

  const topThree = [1, 2, 3];

  if (timesError) return <div>failed to load</div>;
  if (!bestTimes) return BestTimeLoading(loadingArray, topThree);

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      {bestTimes.map((bestTimeObject) => (
        <div
          key={bestTimeObject.track.id}
          className="grid grid-cols-12 place-items-center rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-lg"
        >
          <p className=" text-3xl font-medium text-gray-300">
            {bestTimeObject.track.season_order}
          </p>
          <div className="col-span-10 flex flex-col  items-start justify-center place-self-start pl-10">
            <div>
              <h1 className="text-xl font-bold text-white">
                <Link href={`/tracks/${bestTimeObject.track.query_name}`}>
                  {bestTimeObject.track.country}
                </Link>
              </h1>
              <p className="relative bottom-2 text-sm">
                {' '}
                {bestTimeObject.track.name}
              </p>
            </div>
            {bestTimeObject.times.map((time, index) => (
              <div key={time.id} className="flex items-center gap-2">
                <p className="text-sm text-white">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {time.time} {'-'} {time.username}
                </p>
                {/* check if the time updated is under 30 minutes ago */}
                {new Date(time.created_at) >
                  new Date(Date.now() - 30 * 60 * 1000) && (
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400 opacity-100 duration-100"></div>
                )}
              </div>
            ))}
          </div>
          <div>
            <Image
              className="rounded-full"
              src={`/flags/${bestTimeObject.track.country.toLowerCase()}.png`}
              alt="flag"
              width={100}
              height={100}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function BestTimeLoading(loadingArray: number[], topThree: number[]) {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      {loadingArray.map((loading) => (
        <div
          key={loading}
          className="grid h-28 grid-cols-12 place-items-center rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-lg"
        >
          <p className="animate-pulse text-3xl font-bold text-slate-400 opacity-20 blur-sm">
            {loading}
          </p>
          <div className="col-span-10 flex flex-col  items-start justify-center place-self-start pl-10">
            <h1 className="animate-pulse text-xl font-bold text-slate-400 opacity-20 blur-sm">
              Track
            </h1>
            {topThree.map((top) => (
              <div key={top}>
                <p className="animate-pulse text-sm font-bold text-slate-400 opacity-20 blur-sm">
                  1:30.000 - Username
                </p>
              </div>
            ))}
          </div>
          <div className="">
            <div className="h-12 w-12 animate-pulse rounded-full bg-slate-400 opacity-20 blur-sm"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
