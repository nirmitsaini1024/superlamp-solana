'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonLoaderProps {
  /**
   * Additional CSS class names
   */
  className?: string
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return (
    <div className={cn(
      "animate-pulse rounded-lg bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 bg-[length:200%_100%]",
      className
    )} />
  )
}

/**
 * A full-page skeleton loader for dashboard pages
 */
export function PageSkeletonLoader({ className }: SkeletonLoaderProps) {
  return (
    <div className={cn("space-y-8 p-6", className)}>
      {/* Header skeleton */}
      <div className="space-y-3">
        <SkeletonLoader className="h-9 w-72" />
        <SkeletonLoader className="h-5 w-96" />
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 rounded-xl bg-card/50">
            <div className="space-y-2">
              <SkeletonLoader className="h-4 w-20" />
              <SkeletonLoader className="h-8 w-24" />
            </div>
            <SkeletonLoader className="h-3 w-16" />
          </div>
        ))}
      </div>
      
      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 rounded-xl bg-card/50">
            <div className="space-y-3">
              <SkeletonLoader className="h-5 w-32" />
              <SkeletonLoader className="h-4 w-48" />
              <SkeletonLoader className="h-32 w-full" />
            </div>
            <div className="space-y-2">
              <SkeletonLoader className="h-3 w-full" />
              <SkeletonLoader className="h-3 w-4/5" />
              <SkeletonLoader className="h-3 w-3/5" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom content skeleton */}
      <div className="space-y-6 p-6 rounded-xl bg-card/50">
        <SkeletonLoader className="h-6 w-40" />
        <div className="space-y-3">
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-5/6" />
          <SkeletonLoader className="h-4 w-4/6" />
          <SkeletonLoader className="h-4 w-3/6" />
        </div>
      </div>
    </div>
  )
}
