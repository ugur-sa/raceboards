import Navbar from '@/components/Navbar';
import TimeChart from '@/components/Profile/TimeChart';
import { useSession } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import { Track } from 'types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UserPage = () => {
  const router = useRouter();
  const { user } = router.query;
  const session = useSession();

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  const { data: tracks, error: tracksError } = useSWR<Track[]>(
    `/api/track`,
    fetcher
  );

  if (tracksError) return <div>failed to load</div>;
  if (!tracks) return <div>loading...</div>;

  return (
    <>
      <Head>
        <title>{user}</title>
      </Head>
      <div className="flex h-screen flex-col bg-gray-800">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col items-center gap-10 text-white">
          <h1 className="text-6xl font-bold">{user}</h1>
          <div className="h-auto w-1/2 rounded-lg border border-slate-600 bg-slate-800 shadow-2xl">
            <TimeChart />
          </div>
        </main>
      </div>
    </>
  );
};

export default UserPage;
