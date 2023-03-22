import { ResultResponse } from 'types';
import useSWR from 'swr';
import convertTime from 'utils/convertTime';
import convertTimeFull from 'utils/convertTimeFull';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PracticeResults: React.FC<{ race: string }> = ({ race }) => {
  const { data: results, error: resultsError } = useSWR<ResultResponse>(
    `/api/races/getResults?id=${race}`,
    fetcher
  );

  if (resultsError) return <div>failed to load</div>;
  if (!results) return <div>loading...</div>;

  return (
    <>
      <div className="col-span-1 row-span-1">
        <table className="table w-full text-left text-[8px] shadow-2xl lg:text-lg">
          <tbody>
            <tr className="">
              <th className="z-0">Session</th>
              <td className="pl-1">{results.result[0].session}</td>
            </tr>
            <tr className="">
              <th className="">Track</th>
              <td className="pl-1">{results.track_name}</td>
            </tr>
            <tr className="">
              <th className="">Best lap</th>
              <td className="pl-1">
                {results.result[0].best_lap?.player} (
                {results.result[0].best_lap
                  ? convertTime(results.result[0].best_lap?.time!)
                  : 'N/A'}
                )
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-span-1 row-span-1 row-start-2 xl:col-start-2 xl:row-start-1">
        <table className="table w-full text-left text-[8px] shadow-2xl lg:text-lg">
          <tbody>
            <tr className="">
              <th className="">Max minutes</th>
              <td className="pl-1">{results.result[0].max_minutes}</td>
            </tr>
            <tr className="">
              <th className="">Lasted Laps</th>
              <td className="pl-1">{results.result[0].lasted_laps}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-span-2 row-span-1">
        <table className="table  w-full text-left text-[6px] shadow-2xl lg:text-lg">
          <thead>
            <tr className="">
              <th className="">Pos</th>
              <th className="">Driver</th>
              <th className="">Vehicle</th>
              <th className="">Laps</th>
              <th className="">Best Lap</th>
              <th className="">Gap</th>
            </tr>
          </thead>
          <tbody>
            {results.result[0].results?.map((driver, index) => (
              <tr className="" key={index}>
                <td className="">{index + 1}</td>
                <td className="">{driver.player}</td>
                <td className="">{driver.vehicle}</td>
                <td className="">{driver.laps}</td>
                <td className="">
                  {driver.best_lap !== null
                    ? convertTime(driver.best_lap)
                    : '-'}
                </td>
                <td className="">
                  {index !== 0 && driver.gap !== null
                    ? convertTimeFull(driver.gap)
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PracticeResults;
