import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../config/supabase';
import type { User } from '../types/auth';
import { toast } from 'sonner';

// Role configuration
const VALID_ROLES = ['admin', 'educator', 'student'] as const;
type Role = typeof VALID_ROLES[number];

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  session: any | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
  cleanup: () => void;
}

interface DatabaseUser {
  id: string;
  email: string;
  full_name: string;
  role_id: number;
  roles: { name: string }[];
  created_at: string;
  updated_at: string;
}

// Helper function to validate role
const isValidRole = (role: string): role is Role => {
  return VALID_ROLES.includes(role as Role);
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => {
      // Store subscription
      let authSubscription: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null;

      const cleanup = () => {
        if (authSubscription) {
          authSubscription.data.subscription.unsubscribe();
          authSubscription = null;
        }
      };

      return {
        user: null,
        session: null,
        isLoading: true,
        error: null,
        initialized: false,

        initialize: async () => {
          try {
            // Get initial session
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
              const userData = await fetchUserData(session.user.id);
              set({ 
                user: transformUserData(userData),
                session,
                isLoading: false,
                initialized: true 
              });
            } else {
              set({ 
                user: null,
                session: null,
                isLoading: false,
                initialized: true 
              });
            }

            // Setup auth subscription
            cleanup();
            authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
              if (event === 'SIGNED_OUT') {
                set({ user: null, session: null });
              } else if (session?.user) {
                try {
                  const userData = await fetchUserData(session.user.id);
                  set({ 
                    user: transformUserData(userData),
                    session,
                    error: null 
                  });
                } catch (error) {
                  console.error('Error fetching user data:', error);
                  set({ error: 'Failed to fetch user data' });
                }
              }
            });

          } catch (error) {
            console.error('Error initializing auth:', error);
            set({ 
              error: 'Failed to initialize authentication',
              isLoading: false,
              initialized: true 
            });
          }
        },

        signIn: async (email: string, password: string) => {
          if (!email || !password) {
            throw new Error('Email and password are required');
          }

          set({ isLoading: true, error: null });
          
          try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (authError) throw authError;
            if (!authData?.user) throw new Error('No user data returned from authentication');

            const userData = await fetchUserData(authData.user.id);
            
            if (!userData.roles || userData.roles.length === 0) {
              throw new Error('User has no assigned roles');
            }

            const userRole = userData.roles[0]?.name;
            if (!userRole || !isValidRole(userRole)) {
              throw new Error('Invalid user role');
            }

            set({ 
              user: transformUserData(userData),
              session: authData.session,
              error: null 
            });

          } catch (error) {
            if (error instanceof Error) {
              set({ error: error.message });
              throw error;
            }
            set({ error: 'An unexpected error occurred' });
            throw new Error('Failed to sign in');
          } finally {
            set({ isLoading: false });
          }
        },

        signUp: async (email: string, password: string, fullName: string) => {
          if (!email || !password || !fullName) {
            throw new Error('All fields are required');
          }

          set({ isLoading: true, error: null });

          try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName,
                },
              },
            });

            if (authError) throw authError;
            if (!authData?.user) throw new Error('No user data returned from sign up');

            // Create user profile
            const { error: createError } = await supabase.rpc('handle_new_user', {
              user_id: authData.user.id,
              user_email: email,
              user_name: fullName,
            });

            if (createError) throw createError;

            const userData = await fetchUserData(authData.user.id);
            
            set({ 
              user: transformUserData(userData),
              session: authData.session,
              error: null 
            });

          } catch (error) {
            if (error instanceof Error) {
              set({ error: error.message });
              throw error;
            }
            set({ error: 'An unexpected error occurred' });
            throw new Error('Failed to sign up');
          } finally {
            set({ isLoading: false });
          }
        },

        signOut: async () => {
          set({ isLoading: true, error: null });

          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            set({ user: null, session: null });
          } catch (error) {
            if (error instanceof Error) {
              set({ error: error.message });
              throw error;
            }
            set({ error: 'An unexpected error occurred' });
            throw new Error('Failed to sign out');
          } finally {
            set({ isLoading: false });
          }
        },

        updateUser: async (userData: Partial<User>) => {
          const currentUser = get().user;
          if (!currentUser) throw new Error('No user logged in');

          set({ isLoading: true, error: null });

          try {
            const updates = {
              full_name: userData.fullName,
              updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
              .from('users')
              .update(updates)
              .eq('id', currentUser.id);

            if (error) throw error;

            set(state => ({
              user: state.user ? { ...state.user, ...userData } : null
            }));

          } catch (error) {
            if (error instanceof Error) {
              set({ error: error.message });
              throw error;
            }
            set({ error: 'An unexpected error occurred' });
            throw new Error('Failed to update user');
          } finally {
            set({ isLoading: false });
          }
        },

        cleanup,
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, session: state.session }),
    }
  )
);

// Helper functions
async function fetchUserData(userId: string): Promise<DatabaseUser> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      full_name,
      role_id,
      roles (
        name
      ),
      created_at,
      updated_at
    `)
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('User profile not found');
    }
    throw error;
  }
  if (!data) throw new Error('User data not found');
  return data as DatabaseUser;
}

function transformUserData(dbUser: DatabaseUser): User {
  const role = dbUser.roles[0]?.name;
  if (!role || !isValidRole(role)) {
    throw new Error('Invalid user role');
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    fullName: dbUser.full_name,
    role,
    roleId: dbUser.role_id,
    createdAt: new Date(dbUser.created_at),
    updatedAt: new Date(dbUser.updated_at),
  };
}

// Initialize auth state
useAuth.getState().initialize();