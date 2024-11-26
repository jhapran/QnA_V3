import type { SubscriptionTier } from '../types/subscription';

export const SUBSCRIPTION_PLANS: SubscriptionTier = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out EduQuery',
    price: 0,
    interval: 'month',
    features: [
      'Generate up to 100 questions/month',
      'Basic question types',
      'Single user account',
      'Community support'
    ],
    limits: {
      questionsPerMonth: 100,
      usersPerOrg: 1,
      customBranding: false,
      apiAccess: false,
      priority: false
    }
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    description: 'Great for individual educators',
    price: 29,
    interval: 'month',
    features: [
      'Generate up to 1,000 questions/month',
      'All question types',
      'Up to 5 team members',
      'Email support',
      'Basic analytics'
    ],
    limits: {
      questionsPerMonth: 1000,
      usersPerOrg: 5,
      customBranding: false,
      apiAccess: false,
      priority: false
    }
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    description: 'Perfect for departments and schools',
    price: 99,
    interval: 'month',
    features: [
      'Generate up to 5,000 questions/month',
      'Advanced question types',
      'Up to 20 team members',
      'Priority support',
      'Advanced analytics',
      'API access',
      'Custom branding'
    ],
    limits: {
      questionsPerMonth: 5000,
      usersPerOrg: 20,
      customBranding: true,
      apiAccess: true,
      priority: true
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large institutions and districts',
    price: 499,
    interval: 'month',
    features: [
      'Unlimited questions',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated support',
      'Custom AI models',
      'SLA guarantee',
      'On-premise deployment options'
    ],
    limits: {
      questionsPerMonth: Infinity,
      usersPerOrg: Infinity,
      customBranding: true,
      apiAccess: true,
      priority: true
    }
  }
};