import { create } from 'zustand';
import type { SubscriptionPlan, BillingDetails } from '../types/subscription';
import { stripe } from '../config/stripe';

interface SubscriptionStore {
  currentPlan: SubscriptionPlan | null;
  billingDetails: BillingDetails | null;
  isLoading: boolean;
  error: string | null;
  createCheckoutSession: (priceId: string) => Promise<string | null>;
  cancelSubscription: () => Promise<void>;
  loadBillingDetails: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  currentPlan: null,
  billingDetails: null,
  isLoading: false,
  error: null,

  createCheckoutSession: async (priceId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      if (!sessionId) throw new Error('Failed to create checkout session');

      return sessionId;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create checkout session' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelSubscription: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to cancel subscription' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadBillingDetails: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/billing');
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to load billing details');

      set({ billingDetails: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load billing details' });
    } finally {
      set({ isLoading: false });
    }
  },
}));