import { Track } from 'types';

export default function Tracks({ tracks }: { tracks: Track[] }) {
  //display all tracks in a table
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">Tracks</h1>
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Length</th>
                <th className="px-4 py-2">Country</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id}>
                  <td className="border px-4 py-2">{track.id}</td>
                  <td className="border px-4 py-2">{track.name}</td>
                  <td className="border px-4 py-2">{track.length}m</td>
                  <td className="border px-4 py-2">{track.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
