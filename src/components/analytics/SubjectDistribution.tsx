import { Card, Title, DonutChart } from '@tremor/react';

const mockData = [
  { subject: 'Mathematics', value: 35 },
  { subject: 'Science', value: 25 },
  { subject: 'Literature', value: 20 },
  { subject: 'History', value: 15 },
  { subject: 'Others', value: 5 },
];

export function SubjectDistribution() {
  return (
    <Card>
      <Title>Questions by Subject</Title>
      <DonutChart
        className="h-72 mt-4"
        data={mockData}
        category="value"
        index="subject"
        valueFormatter={(value) => `${value}%`}
        colors={['blue', 'cyan', 'indigo', 'violet', 'slate']}
      />
    </Card>
  );
}