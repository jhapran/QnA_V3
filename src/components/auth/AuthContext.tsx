import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/config/supabase';
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
    let mounted = true;

    // Initial session check
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

    // Set up auth state listener
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
    try {
      // First, ensure the user exists in the public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          role_id,
          roles!inner (
            name
          ),
          created_at,
          updated_at
        `)
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        // If user doesn't exist, they might need to be created
        if (userError.code === 'PGRST116') {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData.session?.user) {
            // Trigger user creation
            const { error: createError } = await supabase.functions.invoke('create-user', {
              body: { userId: sessionData.session.user.id }
            });
            if (createError) throw createError;
            // Retry fetching user data
            return await fetchUserData(userId);
          }
        }
        throw userError;
      }

      if (!userData) {
        throw new Error('User data not found');
      }

      setState({
        user: {
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name,
          role: userData.roles.name,
          createdAt: new Date(userData.created_at),
          updatedAt: new Date(userData.updated_at)
        },
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch user data';
      setState({
        user: null,
        isLoading: false,
        error: message
      });
      toast.error(message);
    }
  };

  const signIn = async (email: string, password: string) => {
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

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              email: email,
              role: 'student'
            }
          ]);

        if (profileError) {
          // If profile creation fails, delete the auth user
          await supabase.auth.admin.deleteUser(data.user.id);
          throw new Error('Failed to create user profile');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  };

  const signOut = async () => {
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
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}