import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Error from '@/components/Error';

export default function Page() {
  const router = useRouter();
  const { track } = router.query;
  const session = useSession();

  return (
    <>{session?.user.aud == 'authenticated' ? <h1>{track}</h1> : <Error />}</>
  );
}
