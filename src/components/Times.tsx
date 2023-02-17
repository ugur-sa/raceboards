import { Time, Track } from 'types';

function deleteTime(id: number, mutate: any, setShowToast: any) {
  //delete the time from the database
  fetch('/api/times/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id }),
  }).then((res) => {
    if (res.status === 200) {
      mutate();
      setShowToast({
        success: true,
        error: false,
        message: 'Time deleted successfully',
      });
      //wait 3 seconds and then hide the toast
      setTimeout(() => {
        setShowToast({
          success: false,
          error: false,
          message: '',
        });
      }, 3000);
    } else {
      setShowToast({
        success: false,
        error: true,
        message: 'Error deleting time',
      });
      //wait 3 seconds and then hide the toast
      setTimeout(() => {
        setShowToast({
          success: false,
          error: false,
          message: '',
        });
      }, 3000);
    }
  });
}

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
  //show the times for the user in a table with the track name and country as columns and the time as the row
  return (
    <>
      <div className="flex flex-col items-center justify-center py-2">
        <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <table className="table">
            <thead>
              <tr>
                <th className="px-4 py-2">Track</th>
                <th className="px-4 py-2">Country</th>
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
                  <td className="px-4 py-2">{time.time}</td>
                  <td className="px-4 py-2">
                    <button
                      className="rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
                      onClick={() => {
                        deleteTime(time.id, mutate, setShowToast);
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
    </>
  );
}
