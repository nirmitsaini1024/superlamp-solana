"use client"

import { trpc } from "@/lib/trpc";
import type { GetAnalyticsInput } from "@/types/analytics";

export function useAnalyticsPrefetch(projectId: string, period: GetAnalyticsInput["period"] = '7d') {
  return trpc.analytics.getAnalytics.useQuery(
    { projectId, period },
    { 
      enabled: Boolean(projectId), 
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache longer
      refetchOnMount: false, // Don't refetch if we have cached data
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: false, // Don't refetch on reconnect
      retry: 1, // Only retry once on failure
    }
  );
}
