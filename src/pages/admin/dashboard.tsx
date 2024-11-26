import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, AreaChart, DonutChart, BarChart } from '@tremor/react';
import { Users, Building2, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { RecentActivity } from '../../components/admin/RecentActivity';

const mockData = {
  users: {
    total: 1250,
    growth: 12.5,
    data: [
      { date: '2024-01', users: 980 },
      { date: '2024-02', users: 1100 },
      { date: '2024-03', users: 1250 }
    ]
  },
  organizations: {
    total: 45,
    growth: 8.3,
    data: [
      { date: '2024-01', orgs: 35 },
      { date: '2024-02', orgs: 40 },
      { date: '2024-03', orgs: 45 }
    ]
  },
  revenue: {
    total: 52500,
    growth: 15.2,
    data: [
      { date: '2024-01', revenue: 42000 },
      { date: '2024-02', revenue: 48000 },
      { date: '2024-03', revenue: 52500 }
    ]
  },
  planDistribution: [
    { name: 'Free', value: 450 },
    { name: 'Basic', value: 350 },
    { name: 'Pro', value: 300 },
    { name: 'Enterprise', value: 150 }
  ]
};

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border-gray-300 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={mockData.users.total}
            change={mockData.users.growth}
            trend="up"
            icon={Users}
          />
          <StatCard
            title="Organizations"
            value={mockData.organizations.total}
            change={mockData.organizations.growth}
            trend="up"
            icon={Building2}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${mockData.revenue.total}`}
            change={mockData.revenue.growth}
            trend="up"
            icon={CreditCard}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <AreaChart
              data={mockData.users.data}
              index="date"
              categories={["users"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value.toLocaleString()} users`}
              showLegend={false}
            />
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
            <AreaChart
              data={mockData.revenue.data}
              index="date"
              categories={["revenue"]}
              colors={["green"]}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              showLegend={false}
            />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Subscription Plans Distribution</h3>
            <DonutChart
              data={mockData.planDistribution}
              category="value"
              index="name"
              valueFormatter={(value) => `${value} users`}
              colors={["slate", "violet", "indigo", "rose"]}
            />
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <RecentActivity />
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}