import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import useSWR from 'swr';
import { useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const router = useRouter();
  const { race_id } = router.query;
  const session = useSession();

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>{race_id}</title>
      </Head>
      <div className="flex h-screen flex-col bg-gray-800">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col items-center gap-10 text-white"></main>
      </div>
    </>
  );
}
