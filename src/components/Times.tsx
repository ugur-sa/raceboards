import { Time, Track } from 'types';

export default function Times({
  times,
  tracks,
}: {
  times: Time[];
  tracks: Track[];
}) {
  //show all times for the user

  return (
    <>
      <div className="">
        {times?.map((time) => (
          <div key={time.id}>
            {/* List all times for the track */}
            <div className="p-4">
              <ul>
                {tracks?.map((track) => (
                  <li key={track.id}>
                    {track.id == time.track_id ? (
                      <p>
                        {track.name} : {time.time}
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
