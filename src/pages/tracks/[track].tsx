import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const { track } = router.query;
  const session = useSession();

  return (
    <>
      {session?.user.aud == 'authenticated' ? (
        <h1>{track}</h1>
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
