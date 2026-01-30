'use client'
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DollarCircleIcon,
  ActivityIcon,
  Coins01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons'
import { RevenueChart } from "@/components/ui/charts/revenue-chart"
import { HourlySalesChart } from "@/components/ui/charts/hourly-sales-chart"
import { ProductUsageChart } from "@/components/ui/charts/product-usage-chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { useSelectedProjectStore } from "@/store/projectStore"
import { useAnalytics } from "@/hooks/analytics/useAnalytics"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'FAILED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

export default function HomePage() {
  const selectedProject = useSelectedProjectStore(s => s.selectedProject);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('7d');
  const [timezone, setTimezone] = useState<string>('UTC');
  const router = useRouter();
  const { data: analytics, isLoading, isFetching } = useAnalytics(selectedProject?.id || '', period);

  if (!selectedProject) {
    return (
      <div className="min-h-screen rounded-full bg-background p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">No Project Selected</h2>
            <p className="text-muted-foreground">Please select a project from the sidebar to view analytics</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !analytics) {
    return (
      <div className="min-h-screen rounded-full bg-background p-8">
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor your sales, revenue, and customer behavior in real-time
            </p>
          </div>
          <div className="gap-4 flex items-center">
          <Select  value={period} onValueChange={(value: '7d' | '30d' | '90d' | 'all') => setPeriod(value)} disabled>
            <SelectTrigger className="w-32 crypto-glass">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="crypto-glass">
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
            <ModeToggle />
          </div>
        </div>
        
        {/* Optimized skeleton loading - only show for initial load */}
        <div className="space-y-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 crypto-glass border-0 rounded-2xl p-8">
              <div className="mb-6">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-6">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="crypto-glass border-0 rounded-2xl p-8">
              <div className="mb-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="crypto-glass border-0 rounded-2xl p-8">
              <div className="mb-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen rounded-full bg-background p-8">
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor your sales, revenue, and customer behavior in real-time
            </p>
          </div>
          <div className="gap-4 flex items-center">
          <Select value={period} onValueChange={(value: '7d' | '30d' | '90d' | 'all') => setPeriod(value)} disabled>
            <SelectTrigger className="w-32 crypto-glass">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="crypto-glass">
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
            <ModeToggle />
          </div>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
            <p className="text-muted-foreground">Start accepting payments to see your analytics</p>
          </div>
        </div>
      </div>
    );
  }

  const { metrics, revenueOverTime, hourlyDistribution, productUsageData, recentTransactions } = analytics;

  return (
    <div className="min-h-screen rounded-full bg-background p-8">
      {/* Header */}
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor your sales, revenue, and customer behavior in real-time
          </p>
        </div>
        <div className="gap-4 flex items-center">
          <Select value={period} onValueChange={(value: '7d' | '30d' | '90d' | 'all') => setPeriod(value)}>
            <SelectTrigger className="w-32 crypto-glass">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="crypto-glass">
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <ModeToggle />
        </div>
      </div>

      {/* Mobile: Essential Metrics Only */}
      <div className="md:hidden space-y-6 mb-8">
        {/* Mobile KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          {isFetching ? (
            <>
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </>
          ) : (
            <>
              <div className="crypto-glass-static border-0 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Revenue</h4>
                  <HugeiconsIcon icon={DollarCircleIcon} className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xl font-bold text-foreground mb-1">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metrics.totalPayments} payments
                </p>
              </div>

              <div className="crypto-glass-static border-0 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Success Rate</h4>
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xl font-bold text-foreground mb-1">
                  {metrics.successRate.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {metrics.successfulPayments} successful
                </p>
              </div>

              <div className="crypto-glass-static border-0 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Avg Transaction</h4>
                  <HugeiconsIcon icon={Coins01Icon} className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-xl font-bold text-foreground mb-1">
                  {formatCurrency(metrics.averageTransactionSize)}
                </p>
                <p className="text-xs text-muted-foreground">Per payment</p>
              </div>

              <div className="crypto-glass-static border-0 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Total Payments</h4>
                  <HugeiconsIcon icon={ActivityIcon} className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-xl font-bold text-foreground mb-1">
                  {metrics.totalPayments.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">All time</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop: Full Charts Section */}
      <div className="hidden md:block space-y-12 mb-12">
        {/* Revenue Over Time with KPI sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 crypto-base border-0 rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Revenue Over Time</h3>
              <p className="text-muted-foreground">Track your revenue trends by currency</p>
            </div>
            <div className="h-96">
              {isFetching ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : revenueOverTime.length > 0 ? (
                <RevenueChart data={revenueOverTime} height={450} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No revenue data available for this period
                </div>
              )}
            </div>
          </div>

          {/* KPI sidebar (1/4) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {isFetching ? (
              <>
                <Skeleton className="h-28 w-full rounded-2xl" />
                <Skeleton className="h-28 w-full rounded-2xl" />
                <Skeleton className="h-28 w-full rounded-2xl" />
                <Skeleton className="h-28 w-full rounded-2xl" />
              </>
            ) : (
              <>
                <div className="crypto-glass-static border-0 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Total Revenue</h4>
                    <HugeiconsIcon icon={DollarCircleIcon} className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {formatCurrency(metrics.totalRevenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {metrics.totalPayments} total payments
                  </p>
                </div>

                <div className="crypto-glass-static border-0 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Success Rate</h4>
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {metrics.successRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {metrics.successfulPayments} successful
                  </p>
                </div>

                <div className="crypto-glass-static border-0 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Avg Transaction</h4>
                    <HugeiconsIcon icon={Coins01Icon} className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {formatCurrency(metrics.averageTransactionSize)}
                  </p>
                  <p className="text-xs text-muted-foreground">Per successful payment</p>
                </div>

                <div className="crypto-glass-static border-0 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Total Payments</h4>
                    <HugeiconsIcon icon={ActivityIcon} className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {metrics.totalPayments.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sales Patterns Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hourly Sales Distribution */}
          <div className="crypto-base border-0 rounded-2xl p-8">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Sales by Hour</h3>
                <p className="text-muted-foreground">When do your customers buy?</p>
              </div>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-36 crypto-glass">
                  <SelectValue placeholder="Timezone" />
                </SelectTrigger>
                <SelectContent className="crypto-base">
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">EDT (New York)</SelectItem>
                  <SelectItem value="America/Los_Angeles">PST (Los Angeles)</SelectItem>
                  <SelectItem value="Asia/Kolkata">IST (India)</SelectItem>
                  <SelectItem value="Europe/London">GMT (London)</SelectItem>
                  <SelectItem value="Asia/Tokyo">JST (Tokyo)</SelectItem>
                  <SelectItem value="Europe/Berlin">CET (Berlin)</SelectItem>
                  <SelectItem value="Australia/Sydney">AEST (Sydney)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isFetching ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : hourlyDistribution.some((h: { count: number }) => h.count > 0) ? (
              <HourlySalesChart data={hourlyDistribution} height={250} timezone={timezone} />
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No sales data available
              </div>
            )}
          </div>
          {/* Product Usage Analysis */}
          <div className="crypto-base border-0 rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Product Usage Analysis</h3>
              <p className="text-muted-foreground">Track which products are most important and popular</p>
            </div>
            {isFetching ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : productUsageData.length > 0 ? (
              <ProductUsageChart data={productUsageData} />
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No payment data available
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Currency Breakdown - Desktop Only */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="crypto-glass-static border-0 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <HugeiconsIcon icon={DollarCircleIcon} className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">USDC Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalUSDC)}</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            {((metrics.totalUSDC / metrics.totalRevenue) * 100 || 0).toFixed(1)}% of total
          </div>
        </div>

        <div className="crypto-glass-static border-0 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <HugeiconsIcon icon={DollarCircleIcon} className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">USDT Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalUSDT)}</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            {((metrics.totalUSDT / metrics.totalRevenue) * 100 || 0).toFixed(1)}% of total
          </div>
        </div>

        <div className="crypto-glass-static border-0 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failed Payments</p>
              <p className="text-2xl font-bold">{metrics.failedPayments}</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            {metrics.pendingPayments} pending
          </div>
        </div>
      </div>

      {/* Payment Status Distribution */}
 

      {/* Recent Transactions - Mobile: Simplified List */}
      <div className="md:hidden mt-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center mb-2">
            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <HugeiconsIcon icon={ActivityIcon} className="w-4 h-4 text-primary" />
            </div>
            Recent Transactions
          </h3>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.slice(0, 3).map((tx: {
              id: string;
              txHash: string | null;
              amount: number;
              currency: 'USDC' | 'USDT' | null;
              status: string;
              createdAt: string;
              products: { name: string; price: number }[];
            }) => (
              <div
                key={tx.id}
                className="crypto-glass-static border-0 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-white/5"
                onClick={() => router.push('/dashboard/events')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {tx.currency || 'N/A'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">
                      {formatCurrency(tx.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </div>
                  </div>
                </div>
                {tx.products.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {tx.products.slice(0, 1).map((product: { name: string; price: number }, i: number) => (
                      <div key={i}>
                        {product.name} ({formatCurrency(product.price)})
                      </div>
                    ))}
                    {tx.products.length > 1 && (
                      <div>+{tx.products.length - 1} more</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="crypto-glass-static border-0 rounded-xl p-6 text-center">
            <p className="text-sm font-medium mb-1">No Transactions Yet</p>
            <p className="text-xs text-muted-foreground">Transactions will appear here once you start receiving payments</p>
          </div>
        )}
      </div>

      {/* Recent Transactions - Desktop: Full Table */}
      <div className="hidden md:block mt-16 crypto-base rounded-2xl p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-foreground flex items-center mb-3">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
              <HugeiconsIcon icon={ActivityIcon} className="w-5 h-5 text-primary" />
            </div>
            Recent Transactions
          </h3>
          <p className="text-muted-foreground text-lg">
            Latest payment transactions across your project
          </p>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="overflow-hidden rounded-xl">
            <Table>
              <TableHeader className="border-white/10">
                <TableRow>
                  <TableHead className="text-foreground/80 font-semibold">Transaction</TableHead>
                  <TableHead className="text-foreground/80 font-semibold">Amount</TableHead>
                  <TableHead className="text-foreground/80 font-semibold">Currency</TableHead>
                  <TableHead className="text-foreground/80 font-semibold">Status</TableHead>
                  <TableHead className="text-foreground/80 font-semibold">Time</TableHead>
                  <TableHead className="text-foreground/80 font-semibold">Products</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.slice(0, 5).map((tx: {
                  id: string;
                  txHash: string | null;
                  amount: number;
                  currency: 'USDC' | 'USDT' | null;
                  status: string;
                  createdAt: string;
                  products: { name: string; price: number }[];
                }) => (
                  <TableRow
                    key={tx.id}
                    className={`
                      transition-all duration-200 cursor-pointer
                      bg-white/[0.01] dark:bg-white/[0.02]
                      hover:bg-white/5
                    `}
                    style={{
                      borderBottom: "none"
                    }}
                    onClick={() => router.push('/events')}
                  >
                    <TableCell>
                      <div>
                        {tx.txHash ? (
                          <button 
                            onClick={() => window.open(`https://solscan.io/tx/${tx.txHash}`, '_blank')}
                            className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                          >
                            Payment
                          </button>
                        ) : (
                          <span className="font-medium text-foreground">Payment</span>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {tx.id.substring(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {formatCurrency(tx.amount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {tx.currency || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tx.status)}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {tx.products.length > 0 ? (
                          <div className="space-y-1">
                            {tx.products.slice(0, 2).map((product: { name: string; price: number }, i: number) => (
                              <div key={i} className="text-muted-foreground">
                                {product.name} ({formatCurrency(product.price)})
                              </div>
                            ))}
                            {tx.products.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{tx.products.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No products</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No Transactions Yet</p>
              <p className="text-sm">Transactions will appear here once you start receiving payments</p>
            </div>
          </div>
        )}
      </div>

   
    </div>
  )
}
