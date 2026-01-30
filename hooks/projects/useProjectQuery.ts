import { trpc } from "@/lib/trpc";

export function useProjectsQuery() {
  return trpc.project.list.useQuery(undefined, {
    staleTime: 1000 * 60 * 10, // 10 minutes - data stays fresh
    gcTime: 1000 * 60 * 20, // 20 minutes - keep in cache longer
    refetchOnMount: false, // Don't refetch if we have cached data
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: 1, // Only retry once on failure
  });
}