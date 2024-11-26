import { Card, AreaChart } from '@tremor/react';

interface RevenueChartProps {
  timeRange: string;
}

const mockRevenueData = [
  { date: '2024-01', revenue: 42000 },
  { date: '2024-02', revenue: 48000 },
  { date: '2024-03', revenue: 52500 },
];

export function RevenueChart({ timeRange }: RevenueChartProps) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
        <select
          value={timeRange}
          className="text-sm border-gray-300 rounded-md"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>
      
      <AreaChart
        data={mockRevenueData}
        index="date"
        categories={["revenue"]}
        colors={["blue"]}
        valueFormatter={(value) => `$${value.toLocaleString()}`}
        showLegend={false}
        className="h-72"
      />
    </Card>
  );
}