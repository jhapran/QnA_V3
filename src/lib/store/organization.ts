import { create } from 'zustand';
import { supabase } from '../config/supabase';
import { toast } from 'sonner';
import { useAuth } from './auth';

// Database types
interface DbOrganization {
  id: string;
  name: string;
  domain: string | null;
  logo_url: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  max_users: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

interface DbOrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'admin' | 'member';
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

// Application types
export interface Organization {
  id: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
  plan: DbOrganization['plan'];
  maxUsers: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: DbOrganizationMember['role'];
  createdAt: Date;
  user?: {
    fullName: string;
    email: string;
  };
}

// Plan limits
const PLAN_LIMITS = {
  free: { maxUsers: 10, features: ['basic'] },
  pro: { maxUsers: 100, features: ['basic', 'advanced'] },
  enterprise: { maxUsers: 1000, features: ['basic', 'advanced', 'premium'] }
} as const;

interface OrganizationState {
  organization: Organization | null;
  members: OrganizationMember[];
  isLoading: boolean;
  error: string | null;
  fetchOrganization: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  createOrganization: (data: { name: string; domain?: string; plan?: Organization['plan'] }) => Promise<void>;
  updateOrganization: (data: Partial<Organization>) => Promise<void>;
  addMember: (email: string, role?: OrganizationMember['role']) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  updateMemberRole: (userId: string, role: OrganizationMember['role']) => Promise<void>;
  cleanup: () => void;
}

// Helper functions
const dbToOrganization = (db: DbOrganization): Organization => ({
  id: db.id,
  name: db.name,
  domain: db.domain,
  logoUrl: db.logo_url,
  plan: db.plan,
  maxUsers: db.max_users,
  features: db.features || [],
  createdAt: new Date(db.created_at),
  updatedAt: new Date(db.updated_at)
});

const dbToMember = (db: DbOrganizationMember): OrganizationMember => ({
  id: db.id,
  organizationId: db.organization_id,
  userId: db.user_id,
  role: db.role,
  createdAt: new Date(db.created_at),
  user: db.user ? {
    fullName: db.user.full_name,
    email: db.user.email
  } : undefined
});

export const useOrganizationStore = create<OrganizationState>((set, get) => {
  // Store subscription for real-time updates
  let organizationSubscription: ReturnType<typeof supabase.channel> | null = null;
  let membersSubscription: ReturnType<typeof supabase.channel> | null = null;

  const setupSubscriptions = (organizationId: string) => {
    // Cleanup existing subscriptions
    cleanup();

    // Subscribe to organization changes
    organizationSubscription = supabase.channel(`org:${organizationId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'organizations',
        filter: `id=eq.${organizationId}`
      }, async (payload) => {
        if (payload.eventType === 'DELETE') {
          set({ organization: null, members: [] });
          return;
        }
        await get().fetchOrganization();
      })
      .subscribe();

    // Subscribe to member changes
    membersSubscription = supabase.channel(`org:${organizationId}:members`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'organization_members',
        filter: `organization_id=eq.${organizationId}`
      }, async () => {
        await get().fetchMembers();
      })
      .subscribe();
  };

  const cleanup = () => {
    organizationSubscription?.unsubscribe();
    membersSubscription?.unsubscribe();
    organizationSubscription = null;
    membersSubscription = null;
  };

  return {
    organization: null,
    members: [],
    isLoading: false,
    error: null,
    cleanup,

    fetchOrganization: async () => {
      try {
        set({ isLoading: true, error: null });
        
        // First, get the user's organization membership
        const { data: memberData, error: memberError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .single();

        if (memberError) {
          if (memberError.code === 'PGRST116') {
            set({ organization: null });
            return;
          }
          throw memberError;
        }

        // Then fetch the organization details
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', memberData.organization_id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Organization not found');

        const organization = dbToOrganization(data);
        set({ organization });

        // Setup real-time subscriptions
        setupSubscriptions(organization.id);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch organization';
        set({ error: message });
        toast.error(message);
      } finally {
        set({ isLoading: false });
      }
    },

    fetchMembers: async () => {
      const { organization } = get();
      if (!organization) return;

      try {
        set({ isLoading: true, error: null });
        
        const { data, error } = await supabase
          .from('organization_members')
          .select(`
            *,
            user:users (
              full_name,
              email
            )
          `)
          .eq('organization_id', organization.id);

        if (error) throw error;

        set({ members: data.map(dbToMember) });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch members';
        set({ error: message });
        toast.error(message);
      } finally {
        set({ isLoading: false });
      }
    },

    createOrganization: async ({ name, domain, plan = 'free' }) => {
      try {
        set({ isLoading: true, error: null });

        const user = useAuth.getState().user;
        if (!user) throw new Error('User not authenticated');

        // Create organization
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name,
            domain,
            plan,
            max_users: PLAN_LIMITS[plan].maxUsers,
            features: PLAN_LIMITS[plan].features
          })
          .select()
          .single();

        if (orgError) throw orgError;
        if (!org) throw new Error('Failed to create organization');

        // Add creator as admin
        const { error: memberError } = await supabase
          .from('organization_members')
          .insert({
            organization_id: org.id,
            user_id: user.id,
            role: 'admin'
          });

        if (memberError) {
          // Rollback organization creation
          await supabase.from('organizations').delete().eq('id', org.id);
          throw memberError;
        }

        const organization = dbToOrganization(org);
        set({ organization });
        
        // Setup real-time subscriptions
        setupSubscriptions(organization.id);
        
        toast.success('Organization created successfully');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create organization';
        set({ error: message });
        toast.error(message);
      } finally {
        set({ isLoading: false });
      }
    },

    updateOrganization: async (data) => {
      const { organization } = get();
      if (!organization) return;

      try {
        set({ isLoading: true, error: null });

        // Validate plan change and user limits
        if (data.plan && data.plan !== organization.plan) {
          const { data: memberCount } = await supabase
            .from('organization_members')
            .select('id', { count: 'exact' })
            .eq('organization_id', organization.id);

          if (memberCount && memberCount > PLAN_LIMITS[data.plan].maxUsers) {
            throw new Error(`Cannot downgrade plan. Current member count (${memberCount}) exceeds plan limit (${PLAN_LIMITS[data.plan].maxUsers})`);
          }
        }

        const updates = {
          name: data.name,
          domain: data.domain,
          logo_url: data.logoUrl,
          plan: data.plan,
          max_users: data.plan ? PLAN_LIMITS[data.plan].maxUsers : data.maxUsers,
          features: data.plan ? PLAN_LIMITS[data.plan].features : data.features,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('organizations')
          .update(updates)
          .eq('id', organization.id);

        if (error) throw error;

        set(state => ({
          organization: state.organization ? {
            ...state.organization,
            ...data,
            maxUsers: updates.max_users,
            features: updates.features || state.organization.features,
            updatedAt: new Date()
          } : null
        }));
        
        toast.success('Organization updated successfully');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update organization';
        set({ error: message });
        toast.error(message);
      } finally {
        set({ isLoading: false });
      }
    },

    addMember: async (email, role = 'member') => {
      const { organization, members } = get();
      if (!organization) return;

      try {
        set({ isLoading: true, error: null });

        // Check member limit
        if (members.length >= organization.maxUsers) {
          throw new Error(`Cannot add more members. Plan limit (${organization.maxUsers}) reached`);
        }

        // First, find the user by email
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        if (userError) throw new Error('User not found');

        // Check if user is already a member
        const existingMember = members.find(m => m.userId === userData.id);
        if (existingMember) {
          throw new Error('User is already a member of this organization');
        }

        // Add user to organization
        const { error } = await supabase
          .from('organization_members')
          .insert({
            organization_id: organization.id,
            user_id: userData.id,
            role
          });

        if (error) throw error;

        // Refresh member list
        await get().fetchMembers();
        toast.success('Member added successfully');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add member';
        set({ error: message });
        toast.error(message);
      } finally {
        set({ isLoading: false });
      }
    },

    removeMember: async (userId) => {
      const { organization, members } = get();
      if (!organization) return;

      try {
        set({ isLoading: true, error: null });

        // Prevent removing the last admin
        const adminCount = members.filter(m => m.role === 'admin').length;
        const targetMember = members.find(m => m.userId === userId);
        
        if (targetMember?.role === 'admin' && adminCount <= 1) {
          throw new Error('Cannot remove the last admin');
        }

        const { error } = await supabase
          .from('organization_members')
          .delete()
          .eq('organization_id', organization.id)
          .eq('user_id', userId);

        if (error) throw error;

        set(state => ({
          members: state.members.filter(member => member.userId !== userId)
        }));
        
        toast.success('Member removed successfully');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to remove member';
        set({ error: message });
        toast.error(message);
      } finally {
        set({ isLoading: false });
      }
    },

    updateMemberRole: async (userId, role) => {
      const { organization, members } = get();
      if (!organization) return;

      try {
        set({ isLoading: true, error: null });

        // Prevent removing the last admin
        if (role === 'member') {
          const adminCount = members.filter(m => m.role === 'admin').length;
          const targetMember = members.find(m => m.userId === userId);
          
          if (targetMember?.role === 'admin' && adminCount <= 1) {
            throw new Error('Cannot demote the last admin');
          }
        }

        const { error } = await supabase
          .from('organization_members')
          .update({ role })
          .eq('organization_id', organization.id)
          .eq('user_id', userId);

        if (error) throw error;

        set(state => ({
          members: state.members.map(member =>
            member.userId === userId ? { ...member, role } : member
          )
        }));
        
        toast.success('Member role updated successfully');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update member role';
        set({ error: message });
        toast.error(message);
      } finally {
        set({ isLoading: false });
      }
    }
  };
});