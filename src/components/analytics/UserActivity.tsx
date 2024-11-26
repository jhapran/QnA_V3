import { Card, Title, LineChart } from '@tremor/react';

interface UserActivityProps {
  timeRange: string;
}

const mockData = [
  { date: '2024-01-01', users: 120 },
  { date: '2024-01-02', users: 150 },
  { date: '2024-01-03', users: 180 },
  { date: '2024-01-04', users: 160 },
  { date: '2024-01-05', users: 200 },
  { date: '2024-01-06', users: 190 },
  { date: '2024-01-07', users: 210 },
];

export function UserActivity({ timeRange }: UserActivityProps) {
  return (
    <Card>
      <Title>Daily Active Users</Title>
      <LineChart
        className="h-72 mt-4"
        data={mockData}
        index="date"
        categories={['users']}
        colors={['blue']}
        valueFormatter={(value) => value.toLocaleString()}
        showLegend={false}
      />
    </Card>
  );
}