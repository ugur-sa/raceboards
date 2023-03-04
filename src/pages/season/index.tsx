import LeaderboardsLoading from '@/components/LeaderboardsLoading';
import Navbar from '@/components/Navbar';
import { useSession } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { UserWithMedals } from 'types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Leaderboards() {
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
        <title>Season {new Date().getFullYear()}</title>
      </Head>
      <div className="flex h-screen flex-col bg-gray-800">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col items-center gap-10 text-white">
          <h1 className="text-6xl font-bold">
            Season {new Date().getFullYear()}
          </h1>
        </main>
      </div>
    </>
  );
}
