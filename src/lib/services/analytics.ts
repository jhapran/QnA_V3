import { UsageMetrics, TopicMetrics, TimeSeriesData } from '../types/analytics';

export async function fetchUsageMetrics(timeRange: string): Promise<UsageMetrics> {
  // In a real application, this would fetch from your API
  return {
    activeUsers: {
      value: 1250,
      change: 12.5,
      trend: 'up',
    },
    questionsGenerated: {
      value: 15420,
      change: 8.3,
      trend: 'up',
    },
    averageResponseTime: {
      value: '1.2s',
      change: -15.2,
      trend: 'down',
    },
    successRate: {
      value: '98.5%',
      change: 2.1,
      trend: 'up',
    },
  };
}

export async function fetchTopicMetrics(timeRange: string): Promise<TopicMetrics[]> {
  // In a real application, this would fetch from your API
  return [
    { topic: 'Algebra', questions: 850, success: 95 },
    { topic: 'Geometry', questions: 750, success: 92 },
    { topic: 'Physics', questions: 650, success: 88 },
    { topic: 'Chemistry', questions: 550, success: 90 },
    { topic: 'Biology', questions: 450, success: 93 },
  ];
}

export async function fetchUserActivity(timeRange: string): Promise<TimeSeriesData[]> {
  // In a real application, this would fetch from your API
  return [
    { date: '2024-01-01', value: 120 },
    { date: '2024-01-02', value: 150 },
    { date: '2024-01-03', value: 180 },
    { date: '2024-01-04', value: 160 },
    { date: '2024-01-05', value: 200 },
    { date: '2024-01-06', value: 190 },
    { date: '2024-01-07', value: 210 },
  ];
}