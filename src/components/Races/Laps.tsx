import useSWR from 'swr';
import { Lap, LapResponse } from 'types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Laps = ({ race, session }: { race: string; session: string }) => {
  const {
    data: lapsResponse,
    error: lapsError,
    mutate,
  } = useSWR<LapResponse>(`/api/races/getLaps?id=${race}`, fetcher);

  if (lapsError) return <div>failed to load</div>;
  if (!lapsResponse) return <div>loading...</div>;

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

  const response = lapsResponse[session as keyof LapResponse];

  return (
    <>
      {lapsResponse.Race ? (
        <div className="p-5">
          {response.map((lapsObject, index) => (
            <div key={index} className="flex w-full flex-col gap-5 text-xl">
              <h2 className="text-3xl">{lapsObject.player}</h2>
              <table className="mb-5 w-full rounded-lg text-center">
                <thead className="bg-gray-800 text-xs uppercase xl:text-xl">
                  <tr>
                    <th className="text-left">Lap</th>
                    <th>Time</th>
                    <th>Sector 1</th>
                    <th>Sector 2</th>
                    <th>Sector 3</th>
                    <th>Compound</th>
                    <th>Cuts</th>
                  </tr>
                </thead>
                <tbody>
                  {lapsObject.laps.map((lap, index) => (
                    <>
                      <tr
                        className={`
                        border-b border-slate-500 text-sm xl:text-xl
                        ${
                          lap.best_lap === true
                            ? 'bg-red-400 hover:bg-red-300 hover:text-black'
                            : ''
                        } 
                        ${
                          lap.personal_best === true
                            ? 'bg-green-400 hover:bg-green-300 hover:text-black'
                            : ''
                        } 
                        ${
                          lap.bad_lap === true
                            ? 'bg-orange-300 hover:bg-orange-200 hover:text-black'
                            : ''
                        }
                        ${
                          lap.cuts > 0
                            ? 'bg-[rgba(255,253,184,0.4)] hover:bg-[rgba(255,253,184,0.9)] hover:text-black'
                            : ''
                        }
                        `}
                        key={index}
                      >
                        <td className="w-16">
                          {lap.cuts !== 0 ? (
                            <div className="flex items-center gap-1">
                              <p>{lap.lap + 1}</p>
                              <p className="text-xs">(INVALID)</p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <p>{lap.lap + 1}</p>
                              <p className="text-xs"></p>
                            </div>
                          )}
                        </td>
                        <td>{lap.cuts > 0 ? '-' : convertTime(lap.time)}</td>
                        <td
                          className={`${
                            lap.best_sector_1 ? 'text-red-600' : ''
                          }`}
                        >
                          {lap.cuts > 0 ? '-' : convertTime(lap.sectors[0])}
                        </td>
                        <td
                          className={`${
                            lap.best_sector_2 ? 'text-red-600' : ''
                          }`}
                        >
                          {lap.cuts > 0 ? '-' : convertTime(lap.sectors[1])}
                        </td>
                        <td
                          className={`${
                            lap.best_sector_3 ? 'text-red-600' : ''
                          }`}
                        >
                          {lap.cuts > 0 ? '-' : convertTime(lap.sectors[2])}
                        </td>
                        <td>{lap.tyre}</td>
                        <td>{lap.cuts}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export default Laps;
