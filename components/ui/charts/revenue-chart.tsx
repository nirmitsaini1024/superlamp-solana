"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart"

interface RevenueDataPoint {
  date: string
  usdc: number
  usdt: number
  total: number
}

interface RevenueChartProps {
  data: RevenueDataPoint[]
  height?: number
}

const chartConfig = {
  usdc: {
    label: "USDC",
    color: "#22c55e",
  },
  usdt: {
    label: "USDT", 
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function RevenueChart({ data, height = 300 }: RevenueChartProps) {
  // Calculate trend
  const trend = data.length >= 2 
    ? ((data[data.length - 1].total - data[0].total) / (data[0].total || 1)) * 100 
    : 0;
  
  const isPositive = trend > 0;
  
  // Format data for display
  const formattedData = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const totalRevenue = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} style={{ height, width: "100%" }}>
        <AreaChart
          accessibilityLayer
          data={formattedData}
          height={height}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            tick={{ fontSize: 12 }}
          />
          <ChartTooltip 
            cursor={false} 
            content={<ChartTooltipContent className="crypto-base"
              formatter={(value, name) => [
                `$${Number(value).toFixed(2)}`,
                name === 'usdc' ? ' USDC' : ' USDT'
              ]}
            />} 
          />
          <defs>
            <linearGradient id="fillUsdc" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#22c55e"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#22c55e"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillUsdt" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#3b82f6"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#3b82f6"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="usdt"
            type="monotone"
            fill="url(#fillUsdt)"
            fillOpacity={0.4}
            stroke="#3b82f6"
            strokeWidth={2}
            stackId="a"
          />
          <Area
            dataKey="usdc"
            type="monotone"
            fill="url(#fillUsdc)"
            fillOpacity={0.4}
            stroke="#22c55e"
            strokeWidth={2}
            stackId="a"
          />
          <ChartLegend verticalAlign="bottom" />
        </AreaChart>
      </ChartContainer>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {isPositive ? (
            <>
              Revenue up {Math.abs(trend).toFixed(1)}% <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : trend < 0 ? (
            <>
              Revenue down {Math.abs(trend).toFixed(1)}% <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          ) : (
            'No change'
          )}
        </div>
        <div className="text-muted-foreground">
          Total: ${totalRevenue.toFixed(2)}
        </div>
      </div>
    </div>
  )
}
