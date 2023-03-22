import useSWR from 'swr';
import { ResultResponse } from 'types';
import convertTime from 'utils/convertTime';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RaceResult: React.FC<{ race: string }> = ({ race }) => {
  const { data: results, error: raceResultsError } = useSWR<ResultResponse>(
    `/api/races/getResults?id=${race}`,
    fetcher
  );

  if (raceResultsError) return <div>failed to load</div>;
  if (!results) return <div>loading...</div>;

  return (
    <>
      <div className="col-span-1 row-span-1">
        <table className="table w-full text-left text-[8px] shadow-2xl lg:text-lg">
          <tbody>
            <tr className="">
              <th className="z-0">Session</th>
              <td className="pl-1">{results.result[2].session}</td>
            </tr>
            <tr className="">
              <th className="z-0">Track</th>
              <td className="pl-1">{results.track_name}</td>
            </tr>
            <tr className="">
              <th className="z-0">Winner</th>
              <td className="pl-1">{results.result[2].winner}</td>
            </tr>
            <tr className="">
              <th className="z-0">Led most laps</th>
              <td className="pl-1">{results.result[2].most_laps_led}</td>
            </tr>
            <tr className="">
              <th className="z-0">Best Lap</th>
              <td className="pl-1">
                {results.result[2].best_lap?.player} (
                {results.result[2].best_lap
                  ? convertTime(results.result[2].best_lap.time)
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
              <th className="">Max laps</th>
              <td className="pl-1">{results.result[2].max_laps}</td>
            </tr>
            <tr className="">
              <th className="">Lasted Laps</th>
              <td className="pl-1">{results.result[2].lasted_laps}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-span-2 row-span-1">
        <table className="table w-full  text-left text-[6px] shadow-2xl lg:text-lg">
          <thead>
            <tr className="">
              <th className="">Pos</th>
              <th className="">Driver</th>
              <th className="">Vehicle</th>
              <th className="">Laps</th>
              <th className="">Time/Retired</th>
              <th className="">Best Lap</th>
              {/* <th className="">Consistency</th> */}
              <th className="">Led</th>
            </tr>
          </thead>
          <tbody>
            {results.result[2].results?.map((driver, index) => (
              <tr className="" key={index}>
                <td className="">{index + 1}</td>
                <td className="">{driver.player}</td>
                <td className="">{driver.vehicle}</td>
                <td className="">{driver.laps}</td>
                <td className="">
                  {driver.time.retired! === -1
                    ? 'DNF'
                    : driver.time.retired! > 0
                    ? driver.time.retired === 1
                      ? `+${driver.time.retired} lap`
                      : `+${driver.time.retired} laps`
                    : convertTime(driver.time.time)}
                </td>
                <td className="">{convertTime(driver.best_lap)}</td>
                {/* <td className="">
                  {driver.consistency}%
                </td> */}
                <td className="">{driver.led}</td>
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
