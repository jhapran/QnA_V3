import { Card, Title, BarChart } from '@tremor/react';

interface TopicInsightsProps {
  timeRange: string;
}

const mockData = [
  { topic: 'Algebra', questions: 850, success: 95 },
  { topic: 'Geometry', questions: 750, success: 92 },
  { topic: 'Physics', questions: 650, success: 88 },
  { topic: 'Chemistry', questions: 550, success: 90 },
  { topic: 'Biology', questions: 450, success: 93 },
];

export function TopicInsights({ timeRange }: TopicInsightsProps) {
  return (
    <Card>
      <Title>Top Topics</Title>
      <BarChart
        className="h-72 mt-4"
        data={mockData}
        index="topic"
        categories={['questions']}
        colors={['blue']}
        valueFormatter={(value) => value.toLocaleString()}
      />
    </Card>
  );
}