import { useRef, useState } from 'react';
import { Time, Track } from 'types';
import Modal from './Modal';

const Times: React.FC<{
  times: Time[];
  tracks: Track[];
  setShowToast: any;
  mutate: any;
}> = ({ times, tracks, setShowToast, mutate }) => {
  const [open, setOpen] = useState(false);
  const [timeToDelete, setTimeToDelete] = useState<Time | null>(null);
  const cancelButtonRef = useRef(null);

  //show the times for the user in a table with the track name and country as columns and the time as the row
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center py-2">
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center text-[10px] md:text-sm xl:text-xl">
          <table className="table">
            <thead>
              <tr>
                <th className="z-0 px-4 py-2">Track</th>
                <th className="hidden px-4 py-2 lg:table-cell">Country</th>
                <th className="hidden px-4 py-2 lg:table-cell">Date</th>
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
                  <td className="hidden px-4 py-2 lg:table-cell">
                    {tracks?.map((track) => (
                      <div key={track.id}>
                        {track.id == time.track_id ? track.country : ''}
                      </div>
                    ))}
                  </td>
                  <td className="hidden px-4 py-2 lg:table-cell">
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
};

export default Times;
