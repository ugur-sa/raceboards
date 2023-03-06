import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import RacesTable from '@/components/Seasons/RacesTable';
import StandingsTable from '@/components/Seasons/StandingsTable';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const router = useRouter();
  const { year } = router.query;
  const session = useSession();

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>{`Season ${new Date().getFullYear()}`}</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-gray-800 xl:h-screen">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col items-center gap-10 font-formula text-white">
          <h1 className="text-6xl font-bold">{`Season ${new Date().getFullYear()}`}</h1>

          <div className="block lg:flex lg:gap-16">
            <div className="mt-8 flex h-52 w-64 flex-col items-center lg:mt-0 lg:h-[300px] lg:w-[600px]">
              <h2 className="mt-2 text-xl font-bold">Standings</h2>
              <div className="lg:h-full lg:w-full">
                <StandingsTable year={year as string} />
              </div>
            </div>
            <div className="mt-8 flex h-52 w-64 flex-col items-center lg:mt-0 lg:h-[300px] lg:w-[600px]">
              <h2 className="mt-2 text-xl font-bold">Races</h2>
              <div className="lg:h-full lg:w-full">
                <RacesTable year={year as string} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
