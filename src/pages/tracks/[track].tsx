import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import useSWR from 'swr';
import { FastestTime, Time, Track } from 'types';
import Image from 'next/image';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const router = useRouter();
  const { track } = router.query;
  const session = useSession();

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  const { data: trackData, error: trackDataError } = useSWR<Track>(
    `/api/track/${track}`,
    fetcher
  );

  const { data: fastestTime, error: fastestTimeError } = useSWR<FastestTime>(
    `/api/times/fastestTime/${track}`,
    fetcher
  );

  if (trackDataError || fastestTimeError) return <div>failed to load</div>;
  if (!trackData || !fastestTime) return <div>loading...</div>;

  return (
    <>
      <Head>
        <title>Tracks</title>
      </Head>
      <div className="flex h-screen flex-col bg-gray-800">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col items-center">
          <div className="flex h-1/4 w-1/4 flex-col items-center justify-center gap-2">
            <Image
              alt="flag"
              src={`/flags/${trackData.country.toLowerCase()}.png`}
              width={50}
              height={50}
              className="w-auto rounded-full shadow-xl"
            />
            <h1 className="text-3xl font-bold text-white">
              {trackData.country}
            </h1>
            <p className="relative bottom-2 text-slate-200 opacity-40">
              {trackData.name}
            </p>
          </div>
          <div className="flex h-screen w-screen justify-center gap-10">
            <div className="h-1/2 w-1/2 rounded-lg bg-slate-700 shadow-2xl"></div>
            <div className="flex h-3/4 w-1/4 flex-col gap-5 rounded-lg bg-slate-700 pt-5 pl-5 shadow-2xl">
              <h2 className="text-xl text-white">Track Details</h2>
              <div>
                <h3>Grand Prix Name</h3>
                <p className="text-slate-200">{trackData.grand_prix_name}</p>
              </div>
              <div>
                <h3>Circuit Name</h3>
                <p className="text-slate-200">{trackData.name}</p>
              </div>
              <div>
                <h3>Length</h3>
                <p className="text-slate-200">{trackData.length / 1000} km</p>
              </div>
              <div>
                <h3>Fastest Time</h3>
                <p className="text-slate-200">
                  {fastestTime.time !== null && fastestTime.user !== null ? (
                    <>
                      {fastestTime.time.time} by {fastestTime.user.name}
                    </>
                  ) : (
                    'No times set'
                  )}
                </p>
              </div>
              <div>
                <h3>Track Image</h3>
                <div className="flex aspect-square justify-center">
                  <Image
                    className="w-auto"
                    src={trackData.track_image}
                    width={100}
                    height={100}
                    alt="track_image"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
