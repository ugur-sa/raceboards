import Image from 'next/image';
import Link from 'next/link';
import { Track } from 'types';

export default function Tracks({ tracks }: { tracks: Track[] }) {
  //array of the flags for each country

  //display all tracks in a table
  return (
    <div className="flex min-h-[calc(100vh-6.1rem)] flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">Tracks</h1>
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <table className="table">
            <thead>
              <tr>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Length</th>
                <th className="px-4 py-2">Country</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id}>
                  <td className="px-4 py-2">{track.season_order}</td>
                  <td className="px-4 py-2">
                    <Link
                      href={track.track_image}
                      className="link hover:text-slate-200"
                    >
                      {track.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{track.length}m</td>
                  <td className="flex justify-between px-4 py-2">
                    {track.country}
                    <Image
                      className="rounded-full"
                      src={`/flags/${track.country}.png`}
                      width={30}
                      height={30}
                      alt="flag"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
