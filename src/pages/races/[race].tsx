import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import Laps from '@/components/Races/Laps';
import RaceResult from '@/components/Races/RaceResult';
import Dropdown from '@/components/Dropdown';
import useSWR from 'swr';
import { Session } from 'types';
import Legend from '@/components/Races/Legend';
import QualificationResult from '@/components/Races/QualificationResult';
import PracticeResults from '@/components/Races/PracticeResults';
import GapsChart from '@/components/Races/GapsChart';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const router = useRouter();
  const { race } = router.query;
  const session = useSession();

  const [selection, setSelection] = useState('Race0');

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  const { data: sessions, error: sessionsError } = useSWR<string[]>(
    `/api/races/getSessions?id=${race}`,
    fetcher
  );

  if (sessionsError) return <div>failed to load</div>;
  if (!sessions) return <div>loading...</div>;

  const dropdownSections = sessions.map((session) => {
    if (session === 'Practice' || session === 'Qualification')
      return [`${session} result`, `${session} laps`, `${session} sectors`];

    return [
      `${session} result`,
      `${session} laps`,
      `${session} sectors`,
      `${session} positions`,
      `${session} gaps`,
    ];
  });

  return (
    <>
      <Head>
        <title>Races</title>
      </Head>
      <div className="flex min-h-screen flex-col bg-gray-800">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col p-10 text-white">
          <div className="rounded-lg bg-slate-700 p-10 shadow-xl">
            <div className="flex justify-between">
              <div className="flex gap-5">
                {sessions.map((session, index) => (
                  <Dropdown
                    key={index}
                    title={session}
                    setSelection={setSelection}
                    dropdownSections={dropdownSections[index]}
                  />
                ))}
              </div>
              {selection === 'Race1' && <Legend />}
              {selection === 'Qualification1' && <Legend />}
              {selection === 'Practice1' && <Legend />}
            </div>
            {selection === 'Race0' && (
              <div className="mt-10 grid grid-cols-1 grid-rows-3 gap-10 xl:grid-cols-2 xl:grid-rows-2">
                <RaceResult race={race as string} />
              </div>
            )}
            {selection === 'Race1' && (
              <div>
                <Laps race={race as string} session="Race" />
              </div>
            )}
            {selection === 'Race2' && <h1>sectors</h1>}
            {selection === 'Race3' && <h1>positions</h1>}
            {selection === 'Race4' && (
              <div className="overflow-x-scroll md:overflow-hidden">
                <GapsChart race_id={race as string} />
              </div>
            )}
            {selection === 'Qualification0' && (
              <div className="mt-10 grid grid-cols-1 grid-rows-3 gap-10 xl:grid-cols-2 xl:grid-rows-2">
                <QualificationResult race={race as string} />
              </div>
            )}
            {selection === 'Qualification1' && (
              <div>
                <Laps race={race as string} session="Qualification" />
              </div>
            )}
            {selection === 'Qualification2' && (
              <div>
                <h1>test</h1>
              </div>
            )}
            {selection === 'Practice0' && (
              <div className="mt-10 grid grid-cols-1 grid-rows-3 gap-10 xl:grid-cols-2 xl:grid-rows-2">
                <PracticeResults race={race as string} />
              </div>
            )}
            {selection === 'Practice1' && (
              <div>
                <Laps race={race as string} session="Practice" />
              </div>
            )}
            {selection === 'Practice2' && (
              <div>
                <h1>test</h1>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
