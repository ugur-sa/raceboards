import Navbar from '@/components/Navbar';
import { useSession } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { ResultFromDB } from 'types';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RacesPage = () => {
  const session = useSession();
  const router = useRouter();

  const handleClick = (id: number) => {
    router.push(`/races/${id}`);
  };

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  const {
    data: results,
    error: resultsError,
    mutate,
  } = useSWR<ResultFromDB[]>(`/api/races/getRaces`, fetcher);

  if (resultsError) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>Races</title>
      </Head>
      <div className="flex h-screen flex-col bg-gray-800">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col items-center gap-10 text-white">
          <h1 className="text-6xl font-bold">Races</h1>
          <div className="h-1/2 w-1/2 rounded-lg bg-slate-700 p-5 shadow-xl xl:h-auto xl:w-[600px]">
            {results ? (
              <table className="w-full text-center">
                <thead className="bg-gray-800 text-xs uppercase xl:text-sm">
                  <tr>
                    <th>#</th>
                    <th>Track</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      className="cursor-pointer border-b border-slate-500 text-sm hover:bg-slate-600 xl:text-lg"
                      key={result.id}
                      onClick={() => {
                        handleClick(result.id);
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{result.track_name}</td>
                      <td>{result.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>loading...</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default RacesPage;
