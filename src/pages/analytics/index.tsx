import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { UsageMetrics } from '../../components/analytics/UsageMetrics';
import { QuestionsChart } from '../../components/analytics/QuestionsChart';
import { SubjectDistribution } from '../../components/analytics/SubjectDistribution';
import { TopicInsights } from '../../components/analytics/TopicInsights';
import { UserActivity } from '../../components/analytics/UserActivity';
import { ExportMenu } from '../../components/analytics/ExportMenu';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor usage, trends, and insights across your organization
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <ExportMenu />
          </div>
        </div>

        <UsageMetrics timeRange={timeRange} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuestionsChart timeRange={timeRange} />
          <SubjectDistribution />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopicInsights timeRange={timeRange} />
          <UserActivity timeRange={timeRange} />
        </div>
      </div>
    </DashboardLayout>
  );
}