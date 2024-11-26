import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/config/supabase';
import type { AuthContextType, AuthState } from '@/lib/types/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setState({
        user: null,
        isLoading: false,
        error: 'Authentication is not properly configured. Please check your environment variables.'
      });
      return;
    }

    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            setState({ user: null, isLoading: false, error: error.message });
          }
          return;
        }

        if (session?.user && mounted) {
          await fetchUserData(session.user.id);
        } else if (mounted) {
          setState({ user: null, isLoading: false, error: null });
        }
      } catch (error) {
        console.error('Auth error:', error);
        if (mounted) {
          setState({ user: null, isLoading: false, error: 'Authentication failed' });
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (session?.user) {
            await fetchUserData(session.user.id);
          } else {
            setState({ user: null, isLoading: false, error: null });
          }
        }
      }
    );

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          roles (
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('User data not found');

      setState({
        user: {
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          role: data.roles.name,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        },
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setState({
        user: null,
        isLoading: false,
        error: 'Failed to fetch user data'
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error('Authentication is not properly configured');
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        await fetchUserData(authData.user.id);
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      setState(prev => ({ ...prev, error: message }));
      toast.error(message);
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error('Authentication is not properly configured');
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({ user: null, isLoading: false, error: null });
      navigate('/');
      toast.success('Successfully signed out');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      setState(prev => ({ ...prev, error: message, isLoading: false }));
      toast.error(message);
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}