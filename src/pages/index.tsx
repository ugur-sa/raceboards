import Head from 'next/head';
import Image from 'next/image';
import { Track } from 'types';
import useSWR from 'swr';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createClient } from '@supabase/supabase-js';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const { data, error } = useSWR<Track[]>('/api/tracks', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log(session);

  return (
    <>
      <Head>
        <title>Race Boards</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/helmet.png" />
      </Head>
      {session?.user.aud !== 'authenticated' ? (
        <div className="h-screen flex justify-center items-center">
          <div className="w-1/3">
            <Auth
              providers={['discord']}
              supabaseClient={supabase}
              onlyThirdPartyProviders={true}
              redirectTo="mood-meter-beta.vercel.app"
            />
          </div>
        </div>
      ) : (
        <main>
          <h1 className="text-3xl">Tracks</h1>
          <button onClick={() => supabase.auth.signOut()}>sign out</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.map((track) => (
              <div
                key={track.id}
                className="bg-white rounded-lg shadow-lg border border-black"
              >
                <Image
                  src={track.track_image}
                  alt={track.name}
                  width={300}
                  height={200}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{track.name}</h2>
                  <p className="text-gray-500">{track.country}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </>
  );
}