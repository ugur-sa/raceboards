import { BestTimeArr } from 'types';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import BestTimeLoading from './BestTimeLoading';
import { useEffect, useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BestTimeTable = () => {
  const { data: bestTimes, error: timesError } = useSWR<BestTimeArr[]>(
    `/api/times/bestTimes`,
    fetcher
  );

  const [newIds, setNewIds] = useState<number[]>([]);

  useEffect(() => {
    const ids =
      bestTimes?.flatMap(({ times }) => times.map(({ id }) => id)) || [];

    const storedIds = JSON.parse(localStorage.getItem('bestTimeIds') || '[]');

    if (storedIds.length === 0) {
      localStorage.setItem('bestTimeIds', JSON.stringify(ids));
      return;
    }

    const diffIds = ids.filter((id) => !storedIds.includes(id));

    if (diffIds.length > 0) {
      setNewIds(diffIds);
      localStorage.setItem(
        'bestTimeIds',
        JSON.stringify([...storedIds, ...diffIds])
      );
    }
  }, [bestTimes]);

  if (timesError) return <div>failed to load</div>;
  if (!bestTimes) return <BestTimeLoading />;

  return (
    <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:w-4/5">
      {bestTimes.map((bestTimeObject) => (
        <div
          key={bestTimeObject.track.id}
          className="grid grid-cols-12 place-items-center rounded-lg border border-gray-700 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-4 shadow-lg"
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
                {newIds.includes(time.id) && (
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
};

export default BestTimeTable;
