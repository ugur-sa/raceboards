import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import useSWR from 'swr';
import { FastestTime, LeaderboardTime, Time, Track } from 'types';
import Image from 'next/image';
import { useEffect } from 'react';
import LapTimesTable from '@/components/LapTimes';
import TracksLoading from '@/components/TracksLoading';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Page = () => {
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

  const { data: times, error: timesError } = useSWR<LeaderboardTime[]>(
    `/api/times/getAllCurrentTimesForTrack?track=${track}`,
    fetcher
  );

  if (trackDataError || fastestTimeError || timesError)
    return <div>failed to load</div>;

  return (
    <>
      <Head>
        <title>{trackData?.name}</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 pb-10 xl:h-full">
        <Navbar />
        {trackData && fastestTime && times ? (
          <main className="flex min-h-0 flex-grow flex-col items-center">
            <div className="w-50 flex h-44 flex-col items-center justify-center gap-2">
              <Image
                alt="flag"
                src={`/flags/${trackData.country.toLowerCase()}.png`}
                width={40}
                height={40}
                className="mx-auto max-w-xs rounded-full shadow-xl"
              />
              <h1 className="text-lg font-bold text-white lg:text-3xl">
                {trackData.country}
              </h1>
              <p className="relative bottom-2 text-xs text-slate-200 opacity-40 lg:text-lg">
                {trackData.name}
              </p>
            </div>
            <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 xl:flex-row xl:items-start">
              <div className="flex h-full w-5/6 flex-col rounded-lg pb-10 shadow-2xl xl:h-[600px] xl:w-[800px]">
                <h2 className="pt-5 pl-5 text-xl text-white">Lap Times</h2>
                <div className="relative overflow-x-auto">
                  <LapTimesTable times={times} fastestTime={fastestTime} />
                </div>
              </div>
              <div className="flex flex-col gap-5 rounded-lg pt-5 pl-5 shadow-2xl xl:h-[850px] xl:w-[400px]">
                <h2 className="text-xl text-white">Track Details</h2>
                <div>
                  <h3 className="text-sm">Grand Prix Name</h3>
                  <p className="text-slate-200">{trackData.grand_prix_name}</p>
                </div>
                <div>
                  <h3 className="text-sm">Circuit Name</h3>
                  <p className="text-slate-200">{trackData.name}</p>
                </div>
                <div>
                  <h3 className="text-sm">Length</h3>
                  <p className="text-slate-200">{trackData.length / 1000} km</p>
                </div>
                {trackData.download_link !== '' ? (
                  <div>
                    <h3 className="text-sm">Download</h3>
                    <Link
                      href={trackData.download_link}
                      className="link text-slate-200"
                      target="_blank"
                    >
                      Download this track
                    </Link>
                  </div>
                ) : (
                  ''
                )}
                <div>
                  <h3 className="text-sm">Fastest Time</h3>
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
                  <h3 className="text-sm">Track Image</h3>
                  <div className="flex aspect-square justify-center pr-5">
                    <Image
                      src={trackData.track_image}
                      width={500}
                      height={500}
                      alt="track_image"
                    />
                  </div>
                  <div className="flex justify-center gap-2 pr-5 text-xs">
                    <p className="text-[rgb(237,60,60)]">Sector 1</p>
                    <p className="text-[rgb(51,118,242)]">Sector 2</p>
                    <p className="text-[rgb(250,183,33)]">Sector 3</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <TracksLoading />
        )}
      </div>
    </>
  );
};

export default Page;
