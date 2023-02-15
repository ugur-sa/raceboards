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
      <h1 className="text-3xl">Times</h1>
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
    </>
  );
}
