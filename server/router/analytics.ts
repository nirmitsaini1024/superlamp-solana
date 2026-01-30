import { getAnalyticsSchema, analyticsResponseSchema } from "@/types/analytics";
import { protectedProcedure, router } from "../trpc";
import prisma from "@/db";
import { TRPCError } from "@trpc/server";

const getAnalytics = protectedProcedure
  .input(getAnalyticsSchema)
  .output(analyticsResponseSchema)
  .query(async ({ ctx, input }) => {
    const { projectId, period } = input;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: ctx.session.user.id,
      },
    });

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found or unauthorized",
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
    }

    // Fetch all payments for the period
    const payments = await prisma.payment.findMany({
      where: {
        projectId,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        products: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate metrics
    const totalPayments = payments.length;
    const successfulPayments = payments.filter(p => p.status === 'CONFIRMED').length;
    const failedPayments = payments.filter(p => p.status === 'FAILED').length;
    const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
    
    const successRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;

    // Calculate revenue (only confirmed payments)
    const confirmedPayments = payments.filter(p => p.status === 'CONFIRMED');
    const totalUSDC = confirmedPayments
      .filter(p => p.currency === 'USDC')
      .reduce((sum, p) => sum + Number(p.amount), 0) / 1_000_000; // Convert from lamports
    
    const totalUSDT = confirmedPayments
      .filter(p => p.currency === 'USDT')
      .reduce((sum, p) => sum + Number(p.amount), 0) / 1_000_000;
    
    const totalRevenue = totalUSDC + totalUSDT;
    const averageTransactionSize = confirmedPayments.length > 0 
      ? totalRevenue / confirmedPayments.length 
      : 0;

    // Revenue over time (daily aggregation with complete timeline)
    const revenueByDate = new Map<string, { usdc: number; usdt: number }>();
    
    confirmedPayments.forEach(payment => {
      const dateKey = payment.createdAt.toISOString().split('T')[0];
      const current = revenueByDate.get(dateKey) || { usdc: 0, usdt: 0 };
      
      const amount = Number(payment.amount) / 1_000_000;
      if (payment.currency === 'USDC') {
        current.usdc += amount;
      } else if (payment.currency === 'USDT') {
        current.usdt += amount;
      }
      
      revenueByDate.set(dateKey, current);
    });

    // Generate complete timeline for the selected period
    const generateCompleteTimeline = () => {
      const timeline: Array<{ date: string; usdc: number; usdt: number; total: number }> = [];
      const currentDate = new Date();
      
      let daysToGenerate = 0;
      switch (period) {
        case '7d':
          daysToGenerate = 7;
          break;
        case '30d':
          daysToGenerate = 30;
          break;
        case '90d':
          daysToGenerate = 90;
          break;
        case 'all':
          // For 'all', we'll generate based on actual data range
          const allDates = Array.from(revenueByDate.keys()).sort();
          if (allDates.length === 0) return [];
          const firstDate = new Date(allDates[0]);
          const lastDate = new Date(allDates[allDates.length - 1]);
          daysToGenerate = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          break;
      }
      
      for (let i = daysToGenerate - 1; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        const data = revenueByDate.get(dateKey) || { usdc: 0, usdt: 0 };
        timeline.push({
          date: dateKey,
          usdc: data.usdc,
          usdt: data.usdt,
          total: data.usdc + data.usdt,
        });
      }
      
      return timeline;
    };

    const revenueOverTime = generateCompleteTimeline();

    // Product usage analysis - Which products are most important
    const productUsage = new Map<string, { count: number; revenue: number; payments: number }>();
    
    confirmedPayments.forEach(payment => {
      const amount = Number(payment.amount) / 1_000_000;
      
      payment.products.forEach(product => {
        const current = productUsage.get(product.name) || { count: 0, revenue: 0, payments: 0 };
        current.count += 1;
        current.revenue += Number(product.price) / 1_000_000;
        current.payments += 1;
        productUsage.set(product.name, current);
      });
    });

    const productUsageData = Array.from(productUsage.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue,
        payments: data.payments,
        averagePrice: data.count > 0 ? data.revenue / data.count : 0,
        percentage: confirmedPayments.length > 0 ? (data.payments / confirmedPayments.length) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 products

    // Hourly distribution (when do people buy)
    const hourlyStats = new Map<number, { count: number; revenue: number }>();
    
    confirmedPayments.forEach(payment => {
      const hour = payment.createdAt.getHours();
      const current = hourlyStats.get(hour) || { count: 0, revenue: 0 };
      current.count += 1;
      current.revenue += Number(payment.amount) / 1_000_000;
      hourlyStats.set(hour, current);
    });

    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hourlyStats.get(hour)?.count || 0,
      revenue: hourlyStats.get(hour)?.revenue || 0,
    }));

    // Top products
    const productStats = new Map<string, { sales: number; revenue: number }>();
    
    confirmedPayments.forEach(payment => {
      payment.products.forEach(product => {
        const current = productStats.get(product.name) || { sales: 0, revenue: 0 };
        current.sales += 1;
        current.revenue += Number(product.price) / 1_000_000;
        productStats.set(product.name, current);
      });
    });

    const topProducts = Array.from(productStats.entries())
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Payment method distribution
    const paymentMethodStats = new Map<string, { count: number; revenue: number }>();
    
    confirmedPayments.forEach(payment => {
      const currency = payment.currency || 'Unknown';
      const current = paymentMethodStats.get(currency) || { count: 0, revenue: 0 };
      current.count += 1;
      current.revenue += Number(payment.amount) / 1_000_000;
      paymentMethodStats.set(currency, current);
    });

    const totalPaymentCount = Array.from(paymentMethodStats.values()).reduce((sum, data) => sum + data.count, 0);
    
    const paymentMethodDistribution = Array.from(paymentMethodStats.entries())
      .map(([currency, data]) => ({
        currency,
        count: data.count,
        revenue: data.revenue,
        percentage: totalPaymentCount > 0 ? (data.count / totalPaymentCount) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Recent transactions (last 10)
    const recentTransactions = payments.slice(0, 10).map(payment => ({
      id: payment.id,
      type: 'PAYMENT',
      currency: payment.currency,
      amount: Number(payment.amount) / 1_000_000,
      status: payment.status,
      createdAt: payment.createdAt.toISOString(),
      txHash: payment.txHash,
      products: payment.products.map(p => ({
        name: p.name,
        price: Number(p.price) / 1_000_000,
      })),
    }));

    // Webhook statistics
    const webhookEndpoints = await prisma.webhookEndpoint.count({
      where: {
        projectId,
        status: 'ACTIVE',
      },
    });

    const eventDeliveries = await prisma.eventDelivery.findMany({
      where: {
        event: {
          projectId,
        },
        createdAt: {
          gte: startDate,
        },
      },
    });

    const webhookSuccessful = eventDeliveries.filter(d => d.deliveryStatus === 'DELIVERED').length;
    const webhookSuccessRate = eventDeliveries.length > 0 
      ? (webhookSuccessful / eventDeliveries.length) * 100 
      : 0;

    // API calls count (from token usage)
    const apiTokens = await prisma.apiToken.findMany({
      where: {
        projectId,
        status: 'ACTIVE',
      },
      select: {
        requestCount: true,
      },
    });

    const apiCallsCount = apiTokens.reduce((sum, token) => sum + token.requestCount, 0);

    return {
      revenueOverTime,
      hourlyDistribution,
      topProducts,
      paymentMethodDistribution,
      productUsageData,
      metrics: {
        totalRevenue,
        totalPayments,
        successfulPayments,
        failedPayments,
        pendingPayments,
        successRate,
        averageTransactionSize,
        totalUSDC,
        totalUSDT,
        totalWebhooks: webhookEndpoints,
        webhookSuccessRate,
        apiCallsCount,
      },
      recentTransactions,
    };
  });

export const analyticsRouter = router({
  getAnalytics,
});

