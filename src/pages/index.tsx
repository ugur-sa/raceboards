import Head from 'next/head';
import Image from 'next/image';
import { Track, Time } from 'types';
import useSWR from 'swr';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Login from '@/components/Login';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BestTimeTable from '@/components/BestTime';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <>
      <Head>
        <title>Raceboards</title>
      </Head>
      {session?.user.aud !== 'authenticated' ? (
        <Login />
      ) : (
        <>
          <Navbar />
          <main>
            <div className="flex h-[calc(100vh-6.1rem)] flex-col items-center justify-center gap-20 bg-gray-800">
              <h1 className="place-self-center text-6xl font-bold text-white ">
                Best Times
              </h1>
              <BestTimeTable />
            </div>
          </main>
        </>
      )}
    </>
  );
}
