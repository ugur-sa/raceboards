import { useSession } from '@supabase/auth-helpers-react';
import { Time, Track } from 'types';
import useSWR from 'swr';
import Tracks from '@/components/Tracks';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import TracksLoading from '@/components/TracksLoading';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TracksPage() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user.aud !== 'authenticated') {
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
      <div className="min-h-screen bg-gray-800 pb-10 text-white">
        {!userTimes || !tracks ? <TracksLoading /> : <Tracks tracks={tracks} />}
      </div>
    </>
  );
}
