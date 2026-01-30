import { z } from "zod";

// Input schemas
export const getAnalyticsSchema = z.object({
  projectId: z.string(),
  period: z.enum(['7d', '30d', '90d', 'all']).default('7d')
});

// Response schemas
export const revenueDataPointSchema = z.object({
  date: z.string(),
  usdc: z.number(),
  usdt: z.number(),
  total: z.number()
});

export const hourlyDistributionSchema = z.object({
  hour: z.number(),
  count: z.number(),
  revenue: z.number()
});

export const topProductSchema = z.object({
  name: z.string(),
  sales: z.number(),
  revenue: z.number()
});

export const paymentMethodDistributionSchema = z.object({
  currency: z.string(),
  count: z.number(),
  revenue: z.number(),
  percentage: z.number()
});

export const productUsageDataPointSchema = z.object({
  name: z.string(),
  count: z.number(),
  revenue: z.number(),
  payments: z.number(),
  averagePrice: z.number(),
  percentage: z.number()
});

export const metricsSchema = z.object({
  totalRevenue: z.number(),
  totalPayments: z.number(),
  successfulPayments: z.number(),
  failedPayments: z.number(),
  pendingPayments: z.number(),
  successRate: z.number(),
  averageTransactionSize: z.number(),
  totalUSDC: z.number(),
  totalUSDT: z.number(),
  totalWebhooks: z.number(),
  webhookSuccessRate: z.number(),
  apiCallsCount: z.number()
});

export const recentTransactionSchema = z.object({
  id: z.string(),
  type: z.string(),
  currency: z.enum(['USDC', 'USDT']).nullable(),
  amount: z.number(),
  status: z.string(),
  createdAt: z.string(),
  txHash: z.string().nullable(),
  products: z.array(z.object({
    name: z.string(),
    price: z.number()
  }))
});

export const analyticsResponseSchema = z.object({
  revenueOverTime: z.array(revenueDataPointSchema),
  hourlyDistribution: z.array(hourlyDistributionSchema),
  topProducts: z.array(topProductSchema),
  paymentMethodDistribution: z.array(paymentMethodDistributionSchema),
  productUsageData: z.array(productUsageDataPointSchema),
  metrics: metricsSchema,
  recentTransactions: z.array(recentTransactionSchema)
});

// Types
export type GetAnalyticsInput = z.infer<typeof getAnalyticsSchema>;
export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>;
export type RevenueDataPoint = z.infer<typeof revenueDataPointSchema>;
export type HourlyDistribution = z.infer<typeof hourlyDistributionSchema>;
export type TopProduct = z.infer<typeof topProductSchema>;
export type PaymentMethodDistribution = z.infer<typeof paymentMethodDistributionSchema>;
export type ProductUsageDataPoint = z.infer<typeof productUsageDataPointSchema>;
export type Metrics = z.infer<typeof metricsSchema>;
export type RecentTransaction = z.infer<typeof recentTransactionSchema>;

