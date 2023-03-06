import { Results } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RacesTable: React.FC<{ year: string }> = ({ year }) => {
  const router = useRouter();

  const handleClick = (id: number) => {
    router.push(`/races/${id}`);
  };

  const {
    data: races,
    error: racesError,
    mutate,
  } = useSWR<Results[]>(`/api/races/${year}`, fetcher);

  if (racesError) return <div>failed to load</div>;
  if (!races) return <div>loading...</div>;

  return (
    <table className="table w-full text-center text-[12px] shadow-2xl lg:text-lg">
      <thead>
        <tr className="border border-slate-500">
          <th className="border border-slate-500">#</th>
          <th className="border border-slate-500">Track</th>
        </tr>
      </thead>
      <tbody>
        {races?.map((race, index) => (
          <tr
            key={index}
            className="cursor-pointer border-b border-slate-500 text-[12px] hover:bg-slate-600 lg:text-lg"
            onClick={() => {
              handleClick(race.id);
            }}
          >
            <td className="border border-slate-500">{index + 1}</td>
            <td className="border border-slate-500">{race.track_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RacesTable;
