import { Card, DonutChart } from '@tremor/react';

const mockSubscriptionData = [
  { name: 'Free', value: 450 },
  { name: 'Basic', value: 350 },
  { name: 'Pro', value: 300 },
  { name: 'Enterprise', value: 150 },
];

export function SubscriptionOverview() {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Distribution</h3>
      </div>

      <DonutChart
        data={mockSubscriptionData}
        category="value"
        index="name"
        valueFormatter={(value) => `${value} users`}
        colors={["slate", "violet", "indigo", "rose"]}
        className="h-72"
      />

      <div className="mt-4 grid grid-cols-2 gap-4">
        {mockSubscriptionData.map((plan) => (
          <div key={plan.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
            <span className="text-sm font-medium text-gray-600">{plan.name}</span>
            <span className="text-sm font-semibold text-gray-900">{plan.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}