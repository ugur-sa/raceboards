import { Time, Track, BestTimeArr } from 'types';
import useSWR from 'swr';
import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import Spinner from './Spinner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BestTimeTable() {
  const session = useSession();

  const { data: bestTimes, error: timesError } = useSWR<BestTimeArr[]>(
    `/api/bestTimes`,
    fetcher
  );

  if (timesError) return <div>failed to load</div>;
  if (!bestTimes) return <Spinner />;

  console.log(bestTimes);

  // create a grid of cards for each track and display the times for each track
  // return (
  //   <div>
  //     {bestTimes.map((bestTimeObject) => (
  //       <div key={bestTimeObject.track}>
  //         <h1>{bestTimeObject.track}</h1>
  //         {bestTimeObject.times.map((time) => (
  //           <div key={time.id}>
  //             <p>{time.time}</p>
  //           </div>
  //         ))}
  //       </div>
  //     ))}
  //   </div>
  // );

  //with the logic from above create a grid with cards for each track and display the times for each track
  //also display 1,2,3 for the top 3 times
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {bestTimes.map((bestTimeObject) => (
        <div
          key={bestTimeObject.track}
          className="rounded-lg bg-gray-800 p-4 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-white">
            {bestTimeObject.track}
          </h1>

          {bestTimeObject.times.map((time, index) => (
            <div key={time.id}>
              <p className="text-white">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {'.'}
                {time.time} {'-'} {time.username}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
