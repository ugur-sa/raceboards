import useSWR from 'swr';
import { LapResponse } from 'types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Laps: React.FC<{ race: string; session: string }> = ({
  race,
  session,
}) => {
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
        <div className="mt-3 lg:p-5">
          <h1 className="mb-10 text-center text-3xl">{`${session} laps`}</h1>
          {response.map((lapsObject, index) => (
            <div key={index} className="flex w-full flex-col gap-5">
              <h2 className="text-md lg:text-3xl">{lapsObject.player}</h2>
              <table className="mb-5 w-full rounded-lg text-center">
                <thead className="bg-gray-800 text-[5px] uppercase xl:text-xl">
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
                        border-b border-slate-500 text-[5px] xl:text-xl
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
                          lap.pit === true
                            ? 'bg-slate-700 hover:bg-slate-700 hover:text-white'
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
                        <td className="w-16 text-left">
                          {lap.cuts !== 0 ? (
                            <div className="flex items-center gap-1">
                              <p>{lap.lap + 1}</p>
                              <p className="text-[3px] lg:text-xs">(INVALID)</p>
                            </div>
                          ) : lap.pit === true ? (
                            <div className="flex items-center gap-1">
                              <p>{lap.lap + 1}</p>
                              <p className="text-[3px] lg:text-xs">(PIT)</p>
                            </div>
                          ) : (
                            <p>{lap.lap + 1}</p>
                          )}
                        </td>
                        <td>{lap.cuts > 0 ? '-' : convertTime(lap.time)}</td>
                        <td
                          className={`${
                            lap.best_sector_1 ? 'text-purple-700' : ''
                          }`}
                        >
                          {lap.cuts > 0 ? '-' : convertTime(lap.sectors[0])}
                        </td>
                        <td
                          className={`${
                            lap.best_sector_2 ? 'text-purple-700' : ''
                          }`}
                        >
                          {lap.cuts > 0 ? '-' : convertTime(lap.sectors[1])}
                        </td>
                        <td
                          className={`${
                            lap.best_sector_3 ? 'text-purple-700' : ''
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
