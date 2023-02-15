import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  //get the current route
  const router = useRouter();
  const supabase = useSupabaseClient();

  console.log(router);

  //create a nav bar with links to the home page and the tracks page and times page
  return (
    <nav className="flex flex-wrap items-center justify-between bg-gray-800 p-6">
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <Link href={'/'}>
          <Image
            src="/helmet.png"
            alt="Raceboards Logo"
            width={50}
            height={50}
          />
        </Link>
        <span className="pl-5 text-xl font-semibold tracking-tight">
          Raceboards
        </span>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center rounded border border-gray-400 px-3 py-2 text-gray-200 hover:border-white hover:text-white">
          <svg
            className="h-3 w-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="block w-full flex-grow lg:flex lg:w-auto lg:items-center">
        <div className="text-sm lg:flex-grow">
          <Link
            href="/"
            className={`mt-4 mr-4 block text-gray-200 hover:text-white lg:mt-0 lg:inline-block ${
              router.pathname === '/' ? 'text-blue-500' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/tracks"
            className={`mt-4 mr-4 block text-gray-200 hover:text-white lg:mt-0 lg:inline-block ${
              router.pathname === '/tracks' ? 'text-blue-500' : ''
            }`}
          >
            Tracks
          </Link>
          <Link
            href="/times"
            className={`mt-4 mr-4 block text-gray-200 hover:text-white lg:mt-0 lg:inline-block ${
              router.pathname === '/times' ? 'text-blue-500' : ''
            }`}
          >
            Times
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-md border-2 border-gray-800 bg-gray-800 text-gray-200 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
