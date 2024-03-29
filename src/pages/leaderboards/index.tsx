import LeaderboardsLoading from '@/components/LeaderboardsLoading';
import Navbar from '@/components/Navbar';
import { useSession } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { UserWithMedals } from 'types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Page = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  const { data: usersWithMedals, error: usersWithMedalsError } = useSWR<
    UserWithMedals[]
  >('/api/times/getAllUsersMedals', fetcher);

  if (usersWithMedalsError) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>Leaderboards</title>
      </Head>
      <div className="flex h-screen flex-col bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col items-center gap-10 text-white">
          <h1 className="text-6xl font-bold">Leaderboards</h1>
          <div className="h-1/2 w-1/2 xl:h-auto xl:w-[600px]">
            {usersWithMedals ? (
              <table className="table w-full text-center shadow-2xl">
                <thead className="bg-gray-800 text-xs uppercase xl:text-sm">
                  <tr>
                    <th className="">#</th>
                    <th className="">User</th>
                    <th className="">🥇</th>
                    <th className="">🥈</th>
                    <th className="">🥉</th>
                  </tr>
                </thead>
                <tbody>
                  {usersWithMedals.map((user, index) => (
                    <tr key={user.id} className="text-sm xl:text-lg">
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.goldMedals}</td>
                      <td>{user.silverMedals}</td>
                      <td>{user.bronzeMedals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <LeaderboardsLoading />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;
