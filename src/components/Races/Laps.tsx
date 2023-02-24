import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Lap } from 'types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Laps = ({ race }: { race: string }) => {
  const router = useRouter();

  const {
    data: laps,
    error: lapsError,
    mutate,
  } = useSWR<Lap[]>(`/api/races/getLaps?id=${race}`, fetcher);

  if (lapsError) return <div>failed to load</div>;

  const convertTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const milliseconds = (time % 1000).toString().padStart(3, '0');
    const secondsLeft = seconds % 60;

    if (minutes > 0) {
      return `${minutes}:${
        secondsLeft < 10 ? '0' : ''
      }${secondsLeft}.${milliseconds}`;
    } else {
      return `${secondsLeft}.${milliseconds}`;
    }
  };

  return (
    <>
      {laps ? (
        <div className="h-1/2 w-1/2 rounded-lg bg-slate-700 p-5 shadow-xl xl:h-auto xl:w-[600px]">
          <table className="w-full text-center">
            <thead className="bg-gray-800 text-xs uppercase xl:text-sm">
              <tr>
                <th>Driver</th>
                <th>Lap Time</th>
                <th>Sector 1</th>
                <th>Sector 2</th>
                <th>Sector 3</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap, index) => (
                <tr
                  className="cursor-pointer border-b border-slate-500 text-sm hover:bg-slate-600 xl:text-lg"
                  key={index}
                >
                  <td>{lap.DriverName}</td>
                  <td>{convertTime(lap.LapTime)}</td>
                  <td>{convertTime(lap.Sectors[0])}</td>
                  <td>{convertTime(lap.Sectors[1])}</td>
                  <td>{convertTime(lap.Sectors[2])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export default Laps;
