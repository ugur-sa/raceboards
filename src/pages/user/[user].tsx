import Navbar from '@/components/Navbar';
import TimeChart from '@/components/Profile/TimeChart';
import TrackSelector from '@/components/Profile/TrackSelector';
import { useSession } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UserPage = () => {
  const router = useRouter();
  const { user } = router.query;
  const session = useSession();

  const [track, setTrack] = useState<number>(10);

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  console.log(track);

  return (
    <>
      <Head>
        <title>{user}</title>
      </Head>
      <div className="flex h-screen flex-col bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col items-center gap-10 text-white">
          <h1 className="text-6xl font-bold">{user}</h1>
          <TrackSelector setTrack={setTrack} />
          {track > 0 && (
            <div className="h-auto w-3/4">
              <TimeChart track={track} />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UserPage;
