'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { getChartData } from '@/lib/dashboard-data';

const chartData = getChartData();

const chartConfig = {
  created: {
    label: 'Created',
    color: 'hsl(var(--primary))',
  },
  resolved: {
    label: 'Resolved',
    color: 'hsl(var(--secondary))',
  },
} satisfies ChartConfig;

export function DisputeVolumeChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={value => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="created" fill="var(--color-created)" radius={4} />
        <Bar dataKey="resolved" fill="var(--color-resolved)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
