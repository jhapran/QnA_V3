export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    questionsPerMonth: number;
    usersPerOrg: number;
    customBranding: boolean;
    apiAccess: boolean;
    priority: boolean;
  };
}

export interface SubscriptionTier {
  free: SubscriptionPlan;
  basic: SubscriptionPlan;
  pro: SubscriptionPlan;
  enterprise: SubscriptionPlan;
}

export interface BillingDetails {
  subscriptionId: string;
  customerId: string;
  plan: keyof SubscriptionTier;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}