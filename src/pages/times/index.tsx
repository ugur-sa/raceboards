import { useSession } from '@supabase/auth-helpers-react';
import { Time, Track } from 'types';
import useSWR from 'swr';
import Times from '@/components/Times';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '@/components/Navbar';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TimesPage() {
  const session = useSession();
  const { data: userTimes, error: timesError } = useSWR<Time[]>(
    `/api/times/?id=${session?.user.id}`,
    fetcher
  );

  const { data: tracks, error: tracksError } = useSWR<Track[]>(
    '/api/track',
    fetcher
  );

  if (timesError || tracksError) return <div>failed to load</div>;
  if (!userTimes || !tracks) return <div>loading...</div>;

  return (
    <>
      <Head>
        <title>Times</title>
      </Head>
      <Navbar />
      <div className="bg-gray-800 text-white">
        <Times times={userTimes} tracks={tracks} />
      </div>
    </>
  );
}
