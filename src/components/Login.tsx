import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';

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
          redirectTo="raceboards.vercel.app"
        />
      </div>
    </div>
  );
}
