"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart"

interface HourlyDataPoint {
  hour: number
  count: number
  revenue: number
}

interface HourlySalesChartProps {
  data: HourlyDataPoint[]
  height?: number
  timezone?: string
}

const chartConfig = {
  count: {
    label: "Sales",
    color: "#f59e0b",
  },
} satisfies ChartConfig

export function HourlySalesChart({ data, height = 250, timezone = 'UTC' }: HourlySalesChartProps) {
  // Convert hours to specified timezone
  const formatHourForTimezone = (hour: number) => {
    try {
      const date = new Date();
      date.setUTCHours(hour, 0, 0, 0);
      
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: true
      });
      
      return formatter.format(date);
    } catch {
      // Fallback to original format if timezone is invalid
      return hour === 0 ? '12 AM' : 
             hour < 12 ? `${hour} AM` :
             hour === 12 ? '12 PM' : `${hour - 12} PM`;
    }
  };

  // Format data for display with timezone conversion
  const formattedData = data.map(d => ({
    ...d,
    hourLabel: formatHourForTimezone(d.hour)
  }));

  // Find peak hour
  const peakHour = data.reduce((max, d) => d.count > max.count ? d : max, data[0]);
  const peakHourLabel = peakHour ? formatHourForTimezone(peakHour.hour) : 'N/A';

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} style={{ height, width: "100%" }}>
        <BarChart
          data={formattedData}
          margin={{
            left: 12,
            right: 12,
          }}
          height={height}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="hourLabel"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip 
            cursor={false} 
            content={<ChartTooltipContent  className="crypto-base"
              formatter={(value) => [
                value,
                ' Sales'
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />} 
          />
          <Bar
            dataKey="count"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
          />
          <ChartLegend verticalAlign="bottom" />
        </BarChart>
      </ChartContainer>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Peak sales at {peakHourLabel}
        </div>
        <div className="text-muted-foreground">
          {peakHour?.count || 0} transactions
        </div>
      </div>
    </div>
  )
}
