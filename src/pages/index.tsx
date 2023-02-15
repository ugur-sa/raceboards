import Head from 'next/head';
import Image from 'next/image';
import { Track, Time } from 'types';
import useSWR from 'swr';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Login from '@/components/Login';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

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
            <div className="flex h-[calc(100vh-6.1rem)]  items-center justify-center bg-gray-800"></div>
          </main>
        </>
      )}
    </>
  );
}
