import { Time, Track } from 'types';

export default function Tracks({
  tracks,
  times,
}: {
  tracks: Track[];
  times: Time[];
}) {
  return (
    <>
      <h1 className="text-3xl">Tracks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks?.map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-lg shadow-lg border border-black"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold">{track.name}</h2>
              <p className="text-gray-500">{track.country}</p>
            </div>
            {/* List all times for the track */}
            <div className="p-4">
              <h3 className="text-lg font-semibold">Times</h3>
              <ul>
                {times?.map((time) => (
                  <li key={time.id}>
                    {track.id == time.track_id ? (
                      <p>
                        {time.user_name} {time.time}
                      </p>
                    ) : (
                      ''
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
