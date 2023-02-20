import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  //get the current route
  const router = useRouter();
  const supabase = useSupabaseClient();
  const session = useSession();

  const dropdown = useRef<any>();
  const handleClick = () => {
    dropdown.current?.classList.toggle('hidden');
    (document.activeElement as HTMLElement).blur();
  };

  //create a nav bar with links to the home page and the tracks page and times page
  return (
    <>
      <nav className="hidden bg-gray-800 p-6 lg:visible lg:flex lg:items-center lg:justify-between">
        <div className="mr-6 flex flex-shrink-0 items-center text-white">
          <Link href={'/'}>
            <Image
              className="h-4 w-auto"
              src="/f1.svg"
              alt="Raceboards Logo"
              width={100}
              height={100}
            />
          </Link>
          <span className="pl-5 text-xl font-semibold tracking-tight">
            Raceboards
          </span>
        </div>
        <div className="flex lg:w-auto lg:flex-grow lg:items-center">
          <div className="text-sm lg:flex-grow">
            <Link
              href="/"
              className={`mt-4 mr-4 block hover:text-white lg:mt-0 lg:inline-block ${
                router.pathname === '/'
                  ? 'text-blue-500 hover:text-blue-400'
                  : 'text-gray-200 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/leaderboards"
              className={`mt-4 mr-4 block hover:text-white lg:mt-0 lg:inline-block ${
                router.pathname === '/leaderboards'
                  ? 'text-blue-500 hover:text-blue-400'
                  : 'text-gray-200 hover:text-white'
              }`}
            >
              Leaderboards
            </Link>
            <Link
              href="/times"
              className={`mt-4 mr-4 block hover:text-white lg:mt-0 lg:inline-block ${
                router.pathname === '/times'
                  ? 'text-blue-500 hover:text-blue-400'
                  : 'text-gray-200 hover:text-white'
              }`}
            >
              Times
            </Link>
            <Link
              href="/races"
              className={`mt-4 mr-4 block lg:mt-0 lg:inline-block ${
                router.pathname === '/races'
                  ? 'text-blue-500 hover:text-blue-400'
                  : 'text-gray-200 hover:text-white'
              }`}
            >
              Races
            </Link>
            <Link
              href={'/'}
              onClick={() => {
                supabase.auth.signOut();
              }}
              className="mt-4 mr-4 block text-gray-200 hover:text-white lg:mt-0 lg:inline-block"
            >
              Sign out
            </Link>
          </div>
          <div className="flex items-center justify-center gap-5 text-gray-200 hover:text-white">
            <p className="text-sm lg:text-lg">
              Welcome, {session?.user.user_metadata.full_name}
            </p>
            <Image
              className="h-8 w-auto rounded-full lg:h-12"
              src={session?.user.user_metadata.avatar_url ?? ''}
              alt="avatar"
              width={50}
              height={50}
            />
          </div>
        </div>
      </nav>
      <div
        className={`dropdown-end dropdown flex justify-between bg-gray-800 pr-10 lg:hidden`}
        ref={dropdown}
      >
        <div className="flex items-center justify-center gap-2 pl-5">
          <Link href={'/'}>
            <Image src="/f1.svg" alt="Raceboards Logo" width={40} height={40} />
          </Link>
          <span className="text-md font-semibold tracking-tight text-white">
            Raceboards
          </span>
        </div>
        <div>
          <label
            tabIndex={0}
            className={`btn-ghost btn`}
            onClick={() => {
              handleClick;
            }}
          >
            Menu
          </label>
          <ul
            tabIndex={0}
            className={`dropdown-content menu rounded-box w-52 bg-base-300 p-2 shadow-xl`}
          >
            <li>
              <div>
                <p className="text-md lg:text-lg">
                  Welcome, {session?.user.user_metadata.full_name}
                </p>
                <Image
                  className="h-8 w-auto rounded-full lg:h-12"
                  src={session?.user.user_metadata.avatar_url ?? ''}
                  alt="avatar"
                  width={70}
                  height={70}
                />
              </div>
            </li>
            <li>
              <Link
                href="/"
                className={`hover:text-white ${
                  router.pathname === '/'
                    ? 'text-blue-500 hover:text-blue-400'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/tracks"
                className={`mt-4 mr-4 block hover:text-white lg:mt-0 lg:inline-block ${
                  router.pathname === '/tracks'
                    ? 'text-blue-500 hover:text-blue-400'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                Tracks
              </Link>
            </li>
            <li>
              <Link
                href="/times"
                className={`mt-4 mr-4 block hover:text-white lg:mt-0 lg:inline-block ${
                  router.pathname === '/times'
                    ? 'text-blue-500 hover:text-blue-400'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                Times
              </Link>
            </li>
            <li>
              <Link
                href="/races"
                className={`mt-4 mr-4 block lg:mt-0 lg:inline-block ${
                  router.pathname === '/races'
                    ? 'text-blue-500 hover:text-blue-400'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                Races
              </Link>
            </li>
            <li>
              <Link
                href={'/'}
                onClick={() => {
                  supabase.auth.signOut();
                }}
                className="mt-4 mr-4 block text-gray-200 hover:text-white lg:mt-0 lg:inline-block"
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
