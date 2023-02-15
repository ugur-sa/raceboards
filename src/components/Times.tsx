import { Time, Track } from 'types';

export default function Times({
  times,
  tracks,
}: {
  times: Time[];
  tracks: Track[];
}) {
  //show the times for the user in a table with the track name and country as columns and the time as the row
  return (
    <>
      <div className="flex flex-col items-center justify-center py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Track</th>
                  <th className="px-4 py-2">Country</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {times?.map((time) => (
                  <tr key={time.id}>
                    <td className="border px-4 py-2">
                      {tracks?.map((track) => (
                        <div key={track.id}>
                          {track.id == time.track_id ? track.name : ''}
                        </div>
                      ))}
                    </td>
                    <td className="border px-4 py-2">
                      {tracks?.map((track) => (
                        <div key={track.id}>
                          {track.id == time.track_id ? track.country : ''}
                        </div>
                      ))}
                    </td>
                    <td className="border px-4 py-2">{time.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
