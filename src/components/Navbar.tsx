import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  //get the current route
  const router = useRouter();
  const supabase = useSupabaseClient();
  const session = useSession();

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
        <div className="flex items-center justify-center gap-5 text-gray-200 hover:text-white">
          <p>Welcome, {session?.user.user_metadata.full_name}</p>
          <Image
            className="rounded-full"
            src={session?.user.user_metadata.avatar_url}
            alt="avatar"
            width={50}
            height={50}
          />
        </div>
      </div>
    </nav>
  );
}
