import useSWR from 'swr';
import { RaceResults } from 'types';
import convertTime from 'utils/convertTime';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RaceResult = ({ race }: { race: string }) => {
  const { data: raceResults, error: raceResultsError } = useSWR<RaceResults>(
    `/api/races/getRaceResults?id=${race}`,
    fetcher
  );

  if (raceResultsError) return <div>failed to load</div>;
  if (!raceResults) return <div>loading...</div>;

  return (
    <>
      <div className="col-span-1 row-span-1">
        <table className="w-full text-left text-sm lg:text-lg">
          <tbody>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Session</th>
              <td className="pl-1">{raceResults.type}</td>
            </tr>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Track</th>
              <td className="pl-1">{raceResults.track_name}</td>
            </tr>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Winner</th>
              <td className="pl-1">{raceResults.winner}</td>
            </tr>
            {/* <tr className="border border-slate-500">
              <th className="border border-slate-500">Led most laps</th>
              <td className="pl-1">{raceResults.led_most_laps}</td>
            </tr> */}
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Best Lap</th>
              <td className="pl-1">
                {raceResults.best_lap.driver} (
                {convertTime(raceResults.best_lap.lapTime)})
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-span-1 row-span-1 row-start-2 xl:col-start-2 xl:row-start-1">
        <table className="w-full text-left text-sm lg:text-lg">
          <tbody>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Max laps</th>
              <td className="pl-1">{raceResults.laps}</td>
            </tr>
            <tr className="border border-slate-500">
              <th className="border border-slate-500">Lasted Laps</th>
              <td className="pl-1">{raceResults.laps}</td>
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
              <th className="border border-slate-500">Time/Retired</th>
              <th className="border border-slate-500">Best Lap</th>
              <th className="border border-slate-500">Consistency</th>
              {/* <th className="border border-slate-500">Led</th> */}
            </tr>
          </thead>
          <tbody>
            {raceResults.driverData.map((driver, index) => (
              <tr className="border border-slate-500" key={index}>
                <td className="border border-slate-500">{index + 1}</td>
                <td className="border border-slate-500">{driver.driver}</td>
                <td className="border border-slate-500">{driver.vehicle}</td>
                <td className="border border-slate-500">{driver.laps}</td>
                <td className="border border-slate-500">
                  {index === 0
                    ? convertTime(driver.timestamp[0])
                    : driver.retired
                    ? `+${raceResults.laps - driver.laps} ${
                        raceResults.laps - driver.laps === 1 ? 'lap' : 'laps'
                      }`
                    : convertTimeFull(driver.timestamp[1])}
                </td>
                <td className="border border-slate-500">
                  {convertTime(driver.bestLap)}
                </td>
                <td className="border border-slate-500">
                  {driver.consistency}%
                </td>
                {/* <td className="border border-slate-500">{driver.led}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RaceResult;

const convertTimeFull = (time: number) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = time % 1000;
  return `+${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};
