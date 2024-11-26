import { motion } from 'framer-motion';
import { Users, FileText, Clock, Zap } from 'lucide-react';
import { Card, Metric, Text } from '@tremor/react';

interface UsageMetricsProps {
  timeRange: string;
}

const mockMetrics = {
  activeUsers: {
    value: 1250,
    change: 12.5,
    trend: 'up' as const,
  },
  questionsGenerated: {
    value: 15420,
    change: 8.3,
    trend: 'up' as const,
  },
  averageResponseTime: {
    value: '1.2s',
    change: -15.2,
    trend: 'down' as const,
  },
  successRate: {
    value: '98.5%',
    change: 2.1,
    trend: 'up' as const,
  },
};

export function UsageMetrics({ timeRange }: UsageMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          title: 'Active Users',
          metric: mockMetrics.activeUsers,
          icon: Users,
          color: 'blue',
        },
        {
          title: 'Questions Generated',
          metric: mockMetrics.questionsGenerated,
          icon: FileText,
          color: 'purple',
        },
        {
          title: 'Avg. Response Time',
          metric: mockMetrics.averageResponseTime,
          icon: Clock,
          color: 'green',
        },
        {
          title: 'Success Rate',
          metric: mockMetrics.successRate,
          icon: Zap,
          color: 'amber',
        },
      ].map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-${item.color}-100`}>
                  <Icon className={`h-5 w-5 text-${item.color}-600`} />
                </div>
                <div className={`flex items-center text-sm ${
                  item.metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>{item.metric.change}%</span>
                </div>
              </div>
              <div>
                <Text>{item.title}</Text>
                <Metric>{item.metric.value}</Metric>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}