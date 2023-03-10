import { useSession } from '@supabase/auth-helpers-react';
import { Time, Track } from 'types';
import useSWR from 'swr';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TracksPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  const { data: userTimes, error: timesError } = useSWR<Time[]>(
    `/api/times/?id=${session?.user.id}`,
    fetcher
  );

  const { data: tracks, error: tracksError } = useSWR<Track[]>(
    '/api/track',
    fetcher
  );

  if (timesError || tracksError) return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>Tracks</title>
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gray-800 pb-10 text-white"></div>
    </>
  );
};

export default TracksPage;
