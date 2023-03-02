import { ResultResponse } from 'types';
import useSWR from 'swr';
import convertTime from 'utils/convertTime';
import convertTimeFull from 'utils/convertTimeFull';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const QualificationResult: React.FC<{ race: string }> = ({ race }) => {
  const { data: results, error: resultsError } = useSWR<ResultResponse>(
    `/api/races/getResults?id=${race}`,
    fetcher
  );

  if (resultsError) return <div>failed to load</div>;
  if (!results) return <div>loading...</div>;

  return (
    <>
      <div className="col-span-1 row-span-1">
        <table className="w-full text-left text-sm lg:text-lg">
          <tbody>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Session</th>
              <td className="pl-1">{results.result[1].session}</td>
            </tr>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Track</th>
              <td className="pl-1">{results.track_name}</td>
            </tr>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Pole</th>
              <td className="pl-1">
                {results.result[1].pole?.player} (
                {results.result[2].best_lap
                  ? convertTime(results.result[1].pole?.time!)
                  : 'N/A'}
                )
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-span-1 row-span-1 row-start-2 xl:col-start-2 xl:row-start-1">
        <table className="w-full text-left text-sm lg:text-lg">
          <tbody>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Max minutes</th>
              <td className="pl-1">{results.result[1].max_minutes}</td>
            </tr>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Lasted Laps</th>
              <td className="pl-1">{results.result[1].lasted_laps}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-span-2 row-span-1">
        <table className="w-full border border-slate-500 text-left text-sm lg:text-lg">
          <thead>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Pos</th>
              <th className="border border-slate-500">Driver</th>
              <th className="border border-slate-500">Vehicle</th>
              <th className="border border-slate-500">Laps</th>
              <th className="border border-slate-500">Best Lap</th>
              <th className="border border-slate-500">Gap</th>
            </tr>
          </thead>
          <tbody>
            {results.result[1].results?.map((driver, index) => (
              <tr className="border border-slate-500" key={index}>
                <td className="border border-slate-500">{index + 1}</td>
                <td className="border border-slate-500">{driver.player}</td>
                <td className="border border-slate-500">{driver.vehicle}</td>
                <td className="border border-slate-500">{driver.laps}</td>
                <td className="border border-slate-500">
                  {convertTime(driver.best_lap)}
                </td>
                <td className="border border-slate-500">
                  {index !== 0 ? convertTimeFull(driver.gap) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default QualificationResult;
