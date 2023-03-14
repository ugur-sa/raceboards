import { FastestTime, LeaderboardTime } from 'types';

const LapTimesTable: React.FC<{
  times: LeaderboardTime[];
  fastestTime: FastestTime;
}> = ({ times, fastestTime }) => {
  return (
    <table className="mt-4 w-full place-self-center text-center">
      <thead className="bg-gray-800 text-sm uppercase">
        <tr>
          <th className="text-slate-200">#</th>
          <th className="text-slate-200">Date</th>
          <th className="text-slate-200">Time</th>
          <th className="text-slate-200">User</th>
          <th className="text-slate-200">Delta</th>
        </tr>
      </thead>
      <tbody>
        {times.map((time, index) => (
          <tr
            key={time.id}
            className={`border-b border-gray-600 xl:text-lg ${
              time.id === fastestTime.time.id ? 'bg-slate-600' : 'bg-slate-700'
            }`}
          >
            <td className="text-slate-200">{index + 1}</td>
            <td className="text-slate-200">
              {new Date(time.created_at).toLocaleDateString()}
            </td>
            <td className="text-slate-200">{time.time}</td>
            <td className="text-slate-200">{time.username}</td>
            <td className="text-slate-200">
              {time.delta !== 0 ? -time.delta / 1000 : ''}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LapTimesTable;
