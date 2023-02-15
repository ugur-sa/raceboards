import { Time, Track, BestTime } from 'types';
import useSWR from 'swr';
import { useSession } from '@supabase/auth-helpers-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BestTimeTable() {
  const session = useSession();

  const { data: bestTimes, error: timesError } = useSWR<BestTime[]>(
    `/api/bestTimes`,
    fetcher
  );

  const { data: tracks, error: tracksError } = useSWR<Track[]>(
    '/api/track',
    fetcher
  );

  if (timesError || tracksError) return <div>failed to load</div>;
  if (!bestTimes || !tracks) return <div>loading...</div>;

  //display each track and the best time and the user who set it in a table
  return (
    <div className="flex flex-col items-center bg-gray-800 text-white">
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Track</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">User</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => {
            const bestTime = bestTimes.find(
              (time) => time.track_id === track.id
            );
            return (
              <tr key={track.id}>
                <td className="border px-4 py-2">{track.name}</td>
                <td className="border px-4 py-2">
                  {bestTime ? bestTime.time : 'N/A'}
                </td>
                <td className="border px-4 py-2">
                  {bestTime ? bestTime.username : 'N/A'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
