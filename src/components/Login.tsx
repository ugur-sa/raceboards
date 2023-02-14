import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';

export default function Login() {
  const supabase = useSupabaseClient();

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-1/3">
        <Auth
          providers={['discord']}
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabase}
          onlyThirdPartyProviders={true}
          redirectTo="raceboards.vercel.app"
        />
      </div>
    </div>
  );
}
