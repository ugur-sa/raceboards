import Image from 'next/image';
import Link from 'next/link';
import { Track } from 'types';

export default function Tracks({ tracks }: { tracks: Track[] }) {
  // display all tracks in a table
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center gap-10 px-20 text-center">
        <h1 className="font-bold sm:text-xl md:text-3xl lg:text-6xl">Tracks</h1>
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center sm:text-xl md:text-xs lg:text-lg">
          <table className="table md:text-[8px] lg:w-3/4 lg:text-lg">
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
                      href={`/tracks/${track.query_name}`}
                      className="link hover:text-slate-200"
                    >
                      {track.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{track.length}m</td>
                  <td className="flex justify-between px-4 py-2">
                    {track.country}
                    <Image
                      className="rounded-full md:h-4 md:w-4 lg:h-8 lg:w-8"
                      src={`/flags/${track.country.toLowerCase()}.png`}
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
