'use client'

import { ModeToggle } from '@/components/ui/theme-toggle'

// Skeleton component for individual stat cards
function StatCardSkeleton() {
  return (
    <div className="group">
      <div className="crypto-glass-static border-0 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-muted/20 to-muted/10">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-xl bg-background/10 backdrop-blur-sm">
              <div className="w-6 h-6 bg-muted animate-pulse rounded" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for the project stats grid
function ProjectStatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton for integration status section
function IntegrationStatusSectionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Main integration card skeleton */}
      <div className="crypto-base border-0 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
          <div className="text-right">
            <div className="h-8 w-12 bg-muted animate-pulse rounded mb-1" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Integration steps skeleton */}
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="group relative p-8 rounded-xl bg-background/50">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  </div>
                  
                  <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="crypto-base border-0 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 bg-muted animate-pulse rounded" />
          </div>
          <div>
            <div className="h-6 w-32 bg-muted animate-pulse rounded mb-1" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="crypto-base p-6 rounded-xl">
              <div className="mb-4">
                <div className="w-8 h-8 bg-muted animate-pulse rounded mb-3" />
                <div className="h-5 w-20 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-8 w-full bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton for project info cards (sidebar)
function ProjectInfoCardsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Currencies & Notifications card */}
      <div className="crypto-base border-0 rounded-2xl p-6">
        <div className="space-y-6">
          {/* Accepted Currencies */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 w-36 bg-muted animate-pulse rounded" />
              <div className="w-8 h-8 bg-muted animate-pulse rounded" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-6 w-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>

          {/* Notification Emails */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 w-24 bg-muted animate-pulse rounded" />
              <div className="w-8 h-8 bg-muted animate-pulse rounded" />
            </div>
            
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg crypto-base">
                  <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resources card */}
      <div className="crypto-base border-0 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-10 w-full bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main overview skeleton component
export function OverviewSkeleton() {
  return (
    <div className="min-h-screen rounded-full bg-background p-8">
      {/* Header Skeleton */}
      <div className="mb-12 flex justify-between items-start">
        <div>
          <div className="h-10 w-64 bg-muted animate-pulse rounded mb-3" />
          <div className="h-6 w-80 bg-muted animate-pulse rounded" />
        </div>
        <div className="gap-4 flex items-center">
          <ModeToggle />
        </div>
      </div>

      <div className="space-y-12">
        {/* Stats Grid Skeleton */}
        <ProjectStatsGridSkeleton />

        {/* Main Content Layout Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content - Integration & Testing */}
          <div className="xl:col-span-3">
            <IntegrationStatusSectionSkeleton />
          </div>

          {/* Sidebar - Project Info */}
          <div className="xl:col-span-1">
            <ProjectInfoCardsSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
