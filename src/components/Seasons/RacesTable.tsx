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
        <tr className="">
          <th className="">#</th>
          <th className="">Track</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {races?.map((race, index) => (
          <tr
            key={index}
            className="cursor-pointer text-[12px] hover:text-gray-300 lg:text-lg"
            onClick={() => {
              handleClick(race.id);
            }}
          >
            <td className="">{index + 1}</td>
            <td className="">{race.track_name}</td>
            {race.created_at !== null && (
              <td>
                {Intl.DateTimeFormat('de-DE').format(new Date(race.created_at))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RacesTable;
