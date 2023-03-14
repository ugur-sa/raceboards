import Head from 'next/head';
import { useSession } from '@supabase/auth-helpers-react';
import Login from '@/components/Login';
import Navbar from '@/components/Navbar';
import BestTimeTable from '@/components/BestTime';

const Home = () => {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Raceboards</title>
      </Head>
      {session?.user.aud !== 'authenticated' ? (
        <Login />
      ) : (
        <>
          <div className="flex h-full flex-col bg-gray-800">
            <Navbar />
            <main className="flex min-h-0 flex-grow flex-col items-center gap-10 p-10">
              <h1 className="place-self-center text-6xl font-bold text-white ">
                Best Times
              </h1>
              <BestTimeTable />
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
