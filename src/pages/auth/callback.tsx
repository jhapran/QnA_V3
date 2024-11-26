import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/config/supabase';
import { toast } from 'sonner';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (!accessToken && !refreshToken) {
          // Check session directly if no tokens in URL
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            setError(sessionError.message);
            toast.error(sessionError.message);
            navigate('/signin');
            return;
          }

          if (session) {
            toast.success('Successfully signed in!');
            navigate('/dashboard');
            return;
          }
        }

        // Set session if tokens are present
        if (accessToken) {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (setSessionError) {
            console.error('Set session error:', setSessionError);
            setError(setSessionError.message);
            toast.error(setSessionError.message);
            navigate('/signin');
            return;
          }

          toast.success('Successfully signed in!');
          navigate('/dashboard');
        } else {
          setError('No access token found');
          toast.error('Authentication failed');
          navigate('/signin');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        toast.error(errorMessage);
        navigate('/signin');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Authentication Error</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigate('/signin')}
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing Sign In...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
