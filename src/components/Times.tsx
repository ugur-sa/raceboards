import { useRef, useState } from 'react';
import { Time, Track } from 'types';
import Modal from './Modal';

export default function Times({
  times,
  tracks,
  setShowToast,
  mutate,
}: {
  times: Time[];
  tracks: Track[];
  setShowToast: any;
  mutate: any;
}) {
  const [open, setOpen] = useState(false);
  const [timeToDelete, setTimeToDelete] = useState<Time | null>(null);
  const cancelButtonRef = useRef(null);

  //show the times for the user in a table with the track name and country as columns and the time as the row
  return (
    <>
      <div className="flex flex-col items-center justify-center py-2">
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <table className="table">
            <thead>
              <tr>
                <th className="z-0 px-4 py-2">Track</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {times?.map((time) => (
                <tr key={time.id}>
                  <td className="px-4 py-2">
                    {tracks?.map((track) => (
                      <div key={track.id}>
                        {track.id == time.track_id ? track.name : ''}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    {tracks?.map((track) => (
                      <div key={track.id}>
                        {track.id == time.track_id ? track.country : ''}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(time.created_at.toString()).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{time.time}</td>
                  <td className="px-4 py-2">
                    <button
                      className="rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
                      onClick={() => {
                        setOpen(true);
                        setTimeToDelete(time);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        open={open}
        setOpen={setOpen}
        cancelButtonRef={cancelButtonRef}
        mutate={mutate}
        setShowToast={setShowToast}
        timeToDelete={timeToDelete}
      />
    </>
  );
}
