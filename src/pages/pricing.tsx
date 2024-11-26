import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SUBSCRIPTION_PLANS } from '../lib/constants/plans';
import { useNavigate } from 'react-router-dom';

export function Pricing() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    navigate('/signup', { state: { plan: planId } });
  };

  const calculatePrice = (monthlyPrice: number, interval: 'month' | 'year'): number => {
    if (interval === 'year') {
      // Apply 20% discount and ensure whole number
      return Math.round(monthlyPrice * 12 * 0.8);
    }
    return monthlyPrice;
  };

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your educational needs
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="relative self-center rounded-lg bg-gray-100 p-0.5 flex">
            <button
              onClick={() => setBillingInterval('month')}
              className={`relative w-28 border-gray-200 py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none ${
                billingInterval === 'month'
                  ? 'bg-white border-gray-200 rounded-md shadow-sm text-gray-900'
                  : 'border border-transparent text-gray-700'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`relative w-28 border-gray-200 py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none ${
                billingInterval === 'year'
                  ? 'bg-white border-gray-200 rounded-md shadow-sm text-gray-900'
                  : 'border border-transparent text-gray-700'
              }`}
            >
              Annual billing
              <span className="absolute -top-2 -right-12 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4 lg:gap-4">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${
                key === 'pro' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {key === 'pro' && (
                <div className="absolute top-0 right-6 -translate-y-1/2">
                  <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">
                    ${calculatePrice(plan.price, billingInterval)}
                  </span>
                  <span className="text-gray-500">/{billingInterval}</span>
                </p>
              </div>

              <ul className="space-y-4 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                className={`mt-8 w-full ${
                  key === 'pro'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : key === 'enterprise'
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : ''
                }`}
              >
                {plan.id === 'enterprise' ? 'Contact sales' : 'Get started'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
