import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { supabase } from '@/lib/config/supabase';
import { Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface OAuthButtonsProps {
  action: 'sign-up' | 'sign-in';
  isDisabled?: boolean;
}

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({ action, isDisabled = false }) => {
  const handleOAuthSignIn = async (provider: Provider) => {
    try {
      if (!supabase) {
        toast.error('Supabase client not initialized');
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('OAuth error:', error);
        toast.error(error.message);
        return;
      }

      if (!data.url) {
        toast.error('No redirect URL returned');
        return;
      }

      // Redirect to the OAuth provider
      window.location.href = data.url;
    } catch (error) {
      console.error('OAuth Sign In Failed:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to initialize OAuth sign in');
      }
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => handleOAuthSignIn('google')}
        disabled={isDisabled}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        {action === 'sign-up' ? 'Sign up' : 'Sign in'} with Google
      </Button>
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => handleOAuthSignIn('github')}
        disabled={isDisabled}
      >
        <FaGithub className="mr-2 h-5 w-5" />
        {action === 'sign-up' ? 'Sign up' : 'Sign in'} with GitHub
      </Button>
    </div>
  );
};
