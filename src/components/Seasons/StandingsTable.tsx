import useSWR from 'swr';
import { Player } from 'types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Standings {
  standings: Player[];
}

const StandingsTable: React.FC<{ year: string }> = ({ year }) => {
  const {
    data: standings,
    error: standingsError,
    mutate,
  } = useSWR<Standings>(`/api/season/${year}`, fetcher);

  if (standingsError) return <div>failed to load</div>;
  if (!standings) return <div>loading...</div>;

  console.log(standings);

  return (
    <table className="table w-full text-center text-[12px] shadow-2xl lg:text-lg">
      <thead>
        <tr className="border border-slate-500">
          <th className="border border-slate-500">Pos</th>
          <th className="border border-slate-500">Name</th>
          <th className="border border-slate-500">Points</th>
        </tr>
      </thead>
      <tbody>
        {standings.standings.map((player, index) => (
          <tr key={index} className="border border-slate-500">
            <td className="border border-slate-500">{index + 1}</td>
            <td className="border border-slate-500">{player.name}</td>
            <td className="border border-slate-500">{player.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StandingsTable;
