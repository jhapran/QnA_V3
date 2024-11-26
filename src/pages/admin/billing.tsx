import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Users, ArrowUpRight, Download } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/button';
import { BillingHistory } from '../../components/billing/BillingHistory';
import { SubscriptionOverview } from '../../components/billing/SubscriptionOverview';
import { RevenueChart } from '../../components/billing/RevenueChart';

const mockBillingStats = {
  mrr: 52500,
  mrrGrowth: 15.2,
  activeSubscriptions: 45,
  subscriptionGrowth: 8.3,
  avgRevenuePerUser: 1166,
  arpuGrowth: 5.5,
};

export function Billing() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor revenue, subscriptions, and billing activities
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => {}}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="ml-1 text-sm font-medium">{mockBillingStats.mrrGrowth}%</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${mockBillingStats.mrr.toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="ml-1 text-sm font-medium">{mockBillingStats.subscriptionGrowth}%</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Active Subscriptions</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {mockBillingStats.activeSubscriptions}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-3">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="ml-1 text-sm font-medium">{mockBillingStats.arpuGrowth}%</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Average Revenue Per User</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${mockBillingStats.avgRevenuePerUser}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart timeRange={timeRange} />
          <SubscriptionOverview />
        </div>

        <BillingHistory />
      </div>
    </AdminLayout>
  );
}