import { trpc } from "@/lib/trpc";

export function useProjectFetchDetails(projectId: string) {
  return trpc.project.details.useQuery(
    { id: projectId! },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh for longer
      gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache longer
      enabled: !!projectId, // Only run query when projectId exists
      refetchOnMount: false, // Don't refetch if we have cached data
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: false, // Don't refetch on reconnect
      retry: 1, // Only retry once on failure
    }
  );
}