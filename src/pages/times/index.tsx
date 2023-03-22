import { useSession } from '@supabase/auth-helpers-react';
import { Time, Track } from 'types';
import useSWR from 'swr';
import Times from '@/components/Times';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import TimesLoading from '@/components/TimesLoading';
import { useRouter } from 'next/router';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

let user_uuid: string | undefined;

function submitTime(e: any, setLoading: any, setShowToast: any, mutate: any) {
  e.preventDefault();
  const data = new FormData(e.target);
  let value = Object.fromEntries(data.entries());

  const time = `${value.minutes}:${value.seconds}.${value.milliseconds}`;
  setLoading(true);
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
  }).then(async (res: Response) => {
    if (res.ok === true) {
      e.target.reset();
      setLoading(false);
      mutate();
      setShowToast({
        success: true,
        error: false,
        message: 'Time Submitted Successfully',
      });
      //wait 3 seconds and then hide the toast
      setTimeout(() => {
        setShowToast({ success: false, error: false, message: '' });
      }, 3000);
    } else {
      setLoading(false);
      //show toast with error message from res.body.message
      const err = await res.json();
      setShowToast({
        success: false,
        error: true,
        message: err.message,
      });
      //wait 3 seconds and then hide the toast
      setTimeout(() => {
        setShowToast({ success: false, error: false, message: '' });
      }, 3000);
    }
  });
}

const TimesPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session?.user && session?.user.aud !== 'authenticated') {
      router.push('/404');
    }
  }, [session, router]);

  user_uuid = session?.user.id;

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState({
    success: false,
    error: false,
    message: '',
  });

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

  return (
    <>
      <Head>
        <title>Times</title>
      </Head>
      <div className="flex h-full flex-col bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900">
        <Navbar />
        <main className="flex min-h-0 flex-grow flex-col">
          <div className="flex flex-col items-center justify-center gap-10 text-white">
            <h1 className="text-6xl font-bold">Times</h1>
            {!userTimes || !tracks ? (
              <TimesLoading />
            ) : (
              <Times
                times={userTimes}
                tracks={tracks}
                setShowToast={setShowToast}
                mutate={mutate}
              />
            )}
            <div className="card mb-5 w-96 bg-slate-800 shadow-xl md:w-1/2">
              <form
                className="card-body"
                onSubmit={(e) =>
                  submitTime(e, setLoading, setShowToast, mutate)
                }
              >
                <div>
                  <label
                    className="mb-2 block text-[14px] font-medium text-white sm:text-sm"
                    htmlFor="track"
                  >
                    Select a Track
                  </label>
                  <select
                    className="select-bordered select w-full text-[10px] sm:text-sm"
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
                    className="mb-2 block text-sm text-[14px] font-medium text-white sm:text-sm"
                    htmlFor="time"
                  >
                    Your Time
                  </label>
                  <div className="flex">
                    <input
                      className="input-bordered input w-full text-[14px] sm:text-sm"
                      type="text"
                      name="minutes"
                      id="time"
                      placeholder="Minutes"
                      maxLength={1}
                      minLength={1}
                      required
                    />
                    <p className="place-self-center text-xl text-[14px] text-white sm:text-sm">
                      :
                    </p>
                    <input
                      className="input-bordered input w-full text-[14px] sm:text-sm"
                      type="text"
                      name="seconds"
                      id="time"
                      placeholder="Seconds"
                      maxLength={2}
                      minLength={2}
                      required
                    />
                    <p className="place-self-center text-xl text-[14px] text-white sm:text-sm">
                      .
                    </p>
                    <input
                      className="input-bordered input w-full text-[14px] sm:text-sm"
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
                    className={`btn-sm btn bg-slate-700 text-white md:btn-md lg:btn-lg ${
                      loading ? 'loading' : ''
                    }}`}
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          {showToast.error ? (
            <div className="toast">
              <div className="alert alert-error">
                <div>
                  <span>{showToast.message}</span>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          {showToast.success ? (
            <div className="toast">
              <div className="alert alert-success">
                <div>
                  <span>{showToast.message}</span>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </main>
      </div>
    </>
  );
};

export default TimesPage;
