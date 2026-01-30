"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ProductUsageDataPoint } from "@/types/analytics";

interface ProductUsageChartProps {
  data: ProductUsageDataPoint[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      count: number;
      revenue: number;
      averagePrice: number;
      percentage: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="crypto-base border-0 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Sales: <span className="text-foreground font-medium">{formatNumber(data.count)}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Revenue: <span className="text-foreground font-medium">{formatCurrency(data.revenue)}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Avg Price: <span className="text-foreground font-medium">{formatCurrency(data.averagePrice)}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Share: <span className="text-foreground font-medium">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function ProductUsageChart({ data }: ProductUsageChartProps) {
  // Use hardcoded colors that work well in both themes
  const colors = [
    '#22c55e', // green-500 - works in both themes
    '#3b82f6', // blue-500 - works in both themes
    '#8b5cf6', // violet-500 - works in both themes
    '#f59e0b', // amber-500 - works in both themes
    '#ef4444', // red-500 - works in both themes
    '#06b6d4', // cyan-500 - works in both themes
    '#84cc16', // lime-500 - works in both themes
    '#f97316', // orange-500 - works in both themes
    '#ec4899', // pink-500 - works in both themes
    '#6366f1', // indigo-500 - works in both themes
  ];

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            left: 12,
            right: 12,
            bottom: 60,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => formatNumber(value)}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
