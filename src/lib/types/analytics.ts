export interface AnalyticsMetric {
  value: number | string;
  change: number;
  trend: 'up' | 'down';
}

export interface UsageMetrics {
  activeUsers: AnalyticsMetric;
  questionsGenerated: AnalyticsMetric;
  averageResponseTime: AnalyticsMetric;
  successRate: AnalyticsMetric;
}

export interface TopicMetrics {
  topic: string;
  questions: number;
  success: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}