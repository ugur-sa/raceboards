import Head from 'next/head';
import Image from 'next/image';
import { Track, Time } from 'types';
import useSWR from 'swr';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Login from '@/components/Login';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

let user_uuid: string | undefined;

function submitTime(e: any) {
  e.preventDefault();
  const data = new FormData(e.target);
  let value = Object.fromEntries(data.entries());

  const time = `${value.minutes}:${value.seconds}.${value.milliseconds}`;

  fetch('/api/times', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: user_uuid,
      track: value.track,
      time: time,
    }),
  }).then((res) => {
    if (res.ok === true) {
      alert('Time submitted!');
      e.target.reset();
    } else {
      alert('Something went wrong!');
    }
  });
}

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const { data: tracks, error: tracksError } = useSWR<Track[]>(
    '/api/track',
    fetcher
  );

  if (tracksError) return <div>failed to load</div>;
  if (!tracks) return <div>loading...</div>;

  user_uuid = session?.user.id;

  return (
    <>
      <Head>
        <title>Raceboards</title>
      </Head>
      {session?.user.aud !== 'authenticated' ? (
        <Login />
      ) : (
        <>
          <header className="grid h-20 grid-cols-3 bg-[#3D3D3D]">
            <div className="place-self-center justify-self-start">
              <Link className="pl-5 text-xl text-white" href={'/times'}>
                Times
              </Link>
              <Link className="pl-5 text-xl text-white" href={'/tracks'}>
                Tracks
              </Link>
            </div>
            <div className="col-start-2 flex items-center gap-5 place-self-center">
              <h1 className="text-3xl font-light text-white">
                Willkommen zu Raceboards,{' '}
                {session?.user.user_metadata.full_name}
              </h1>
              <Image
                src={session.user.user_metadata.avatar_url}
                className="rounded-full"
                alt="avatar"
                width={50}
                height={50}
              />
            </div>
            <button
              className="place-self-center justify-self-end pr-5"
              onClick={() => supabase.auth.signOut()}
            >
              <Image src="/logout.svg" width={20} height={20} alt="logout" />
            </button>
          </header>
          <main>
            <div className="flex h-[calc(100vh-5rem)]  items-center justify-center bg-gray-800">
              <div className="w-1/3 rounded-lg border border-gray-600 bg-gray-600 p-2  shadow-xl">
                <form onSubmit={submitTime}>
                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-white"
                      htmlFor="track"
                    >
                      Track
                    </label>
                    <select
                      className=" block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500  focus:ring-blue-500 "
                      name="track"
                      id="track"
                    >
                      {tracks?.map((track) => (
                        <option key={track.id} value={track.name}>
                          {track.name} ({track.country})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-white"
                      htmlFor="time"
                    >
                      Time
                    </label>
                    <div className="flex">
                      <input
                        className='"bg-gray-50 block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 '
                        type="text"
                        name="minutes"
                        id="time"
                        placeholder="Minutes"
                        maxLength={1}
                        minLength={1}
                        required
                      />
                      <p className="place-self-center text-xl text-white">:</p>
                      <input
                        className='"bg-gray-50 block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 '
                        type="text"
                        name="seconds"
                        id="time"
                        placeholder="Seconds"
                        maxLength={2}
                        minLength={2}
                        required
                      />
                      <p className="place-self-center text-xl text-white">.</p>
                      <input
                        className='"bg-gray-50 block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 '
                        type="text"
                        name="milliseconds"
                        id="time"
                        placeholder="Milliseconds"
                        maxLength={3}
                        minLength={3}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      className="mt-3 w-full  rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 sm:w-auto "
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
}
