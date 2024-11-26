import { Card, Title, AreaChart } from '@tremor/react';

interface QuestionsChartProps {
  timeRange: string;
}

const mockData = [
  { date: '2024-01', generated: 4200, successful: 4100 },
  { date: '2024-02', generated: 4800, successful: 4650 },
  { date: '2024-03', generated: 5250, successful: 5100 },
];

export function QuestionsChart({ timeRange }: QuestionsChartProps) {
  return (
    <Card>
      <Title>Questions Generated Over Time</Title>
      <AreaChart
        className="h-72 mt-4"
        data={mockData}
        index="date"
        categories={['generated', 'successful']}
        colors={['blue', 'green']}
        valueFormatter={(value) => value.toLocaleString()}
      />
    </Card>
  );
}