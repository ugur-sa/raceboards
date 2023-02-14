import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export default function Login() {
  const supabase = useSupabaseClient();

  return (
    <div className="h-screen flex justify-center items-center bg-[#3D3D3D]">
      <div className="dark:bg-[#1F1F1F] rounded-lg p-10 w-1/3">
        <Auth
          providers={['discord', 'google']}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          supabaseClient={supabase}
          socialLayout="horizontal"
          redirectTo={getURL()}
        />
      </div>
    </div>
  );
}
