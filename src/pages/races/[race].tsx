import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Lap, ResultFromDB } from 'types';
import Laps from '@/components/Races/Laps';
import RaceResult from '@/components/Races/RaceResult';
import Dropdown from '@/components/Dropdown';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const router = useRouter();
  const { race } = router.query;
  const session = useSession();

  const [selection, setSelection] = useState(0);

  console.log(selection);

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Races</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-gray-800 xl:h-screen">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col p-10 text-white">
          <div className="rounded-lg bg-slate-700 p-10 shadow-xl">
            <Dropdown title="Race" setSelection={setSelection} />
            <div className="mt-10 grid grid-cols-1 grid-rows-3 gap-10 xl:grid-cols-2 xl:grid-rows-2">
              {selection === 0 && <RaceResult race={race as string} />}
              {selection === 1 && <Laps race={race as string} />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
