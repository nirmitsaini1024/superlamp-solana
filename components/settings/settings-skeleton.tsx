'use client'

import { ModeToggle } from '@/components/ui/theme-toggle'

// Skeleton component for individual cards
function CardSkeleton() {
  return (
    <div className="crypto-base border-0 rounded-2xl p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for project setup section
function ProjectSetupSkeleton() {
  return (
    <div className="crypto-base border-0 rounded-2xl p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
        </div>
        
        {/* Logo section */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-muted animate-pulse rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
        
        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-20 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>
        
        {/* Save button */}
        <div className="h-10 w-24 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}

// Skeleton for API token and webhook sections
function DeveloperToolsSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
      {Array.from({ length: 2 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton for notifications and preferences
function NotificationsSkeleton() {
  return (
    <div className="crypto-base border-0 rounded-2xl p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        </div>
        
        {/* Currencies section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 bg-muted animate-pulse rounded" />
            <div className="h-6 w-8 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg crypto-glass-static">
                <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-12 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Emails section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-5 w-20 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-8 w-48 bg-muted animate-pulse rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for danger zone
function DangerZoneSkeleton() {
  return (
    <div className="crypto-base border-0 rounded-2xl p-8">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </div>
        
        {/* Content */}
        <div className="p-4 rounded-lg">
          <div className="space-y-4">
            <div>
              <div className="h-5 w-24 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main settings skeleton component
export function SettingsSkeleton() {
  return (
    <div className="p-8">
      {/* Header Skeleton */}
      <div className="mb-6 flex items-start justify-between mx-auto">
        <div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="gap-3 flex items-center">
          <ModeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-8">
          <ProjectSetupSkeleton />
          <DeveloperToolsSkeleton />
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-8">
          <NotificationsSkeleton />
          <DangerZoneSkeleton />
        </div>
      </div>
    </div>
  );
}
