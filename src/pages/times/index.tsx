import { useSession } from '@supabase/auth-helpers-react';
import { Time, Track } from 'types';
import useSWR from 'swr';
import Times from '@/components/Times';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
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
      e.target.reset();
      console.log('success');
    } else {
      console.log('error');
    }
  });
}

export default function TimesPage() {
  const session = useSession();

  user_uuid = session?.user.id;

  const {
    data: userTimes,
    error: timesError,
    mutate,
  } = useSWR<Time[]>(`/api/times/?id=${session?.user.id}`, fetcher);

  const { data: tracks, error: tracksError } = useSWR<Track[]>(
    '/api/track',
    fetcher
  );

  if (timesError || tracksError) return <div>failed to load</div>;
  if (!userTimes || !tracks) return <div>loading...</div>;

  return (
    <>
      <Head>
        <title>Times</title>
      </Head>
      {session?.user.aud == 'authenticated' ? (
        <>
          <Navbar />
          <div className="flex min-h-[calc(100vh-6.1rem)] flex-col items-center gap-20 bg-gray-800 text-white">
            <h1 className="place-self-center text-6xl font-bold">Times</h1>
            <Times times={userTimes} tracks={tracks} mutate={mutate} />
            <div className="w-1/3 rounded-lg border border-gray-600 bg-gray-600 p-2  shadow-xl">
              <form onSubmit={(e) => submitTime(e)}>
                <div>
                  <label
                    className="mb-2 block text-sm font-medium text-white"
                    htmlFor="track"
                  >
                    Select a Track
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
                    Your Time
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
                    onClick={() => mutate()}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="text-6xl font-bold">You are not logged in</h1>
          <Link className="link" href="/">
            Go to login
          </Link>
        </div>
      )}
    </>
  );
}
