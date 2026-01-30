'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  Settings01Icon,
  Mail01Icon,
  BookOpen01Icon,
  ArrowUpRightIcon,
  PlusSignIcon
} from '@hugeicons/core-free-icons'
import Link from 'next/link'
import type { ProjectDetails } from '@/types/project'

interface ProjectInfoCardsProps {
  project: ProjectDetails
}

export function ProjectInfoCards({ project }: ProjectInfoCardsProps) {
  return (
    <div className="space-y-6">
      {/* Currencies & Notifications */}
      <div className="crypto-base border-0 rounded-2xl p-6">
        <div className="space-y-6">
          {/* Accepted Currencies */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Accepted Currencies</h4>
              <Button asChild size="sm" variant="ghost" className="crypto-button">
                <Link href="/dashboard/settings">
                  <HugeiconsIcon icon={Settings01Icon} className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            {project.acceptedCurrencies?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.acceptedCurrencies.map((currency: string) => (
                  <Badge key={currency} variant="secondary" className="crypto-base">
                    {currency}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <HugeiconsIcon icon={PlusSignIcon} className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">No currencies configured</p>
                <Button asChild size="sm" className="crypto-button">
                  <Link href="/dashboard/settings">Add Currencies</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Notification Emails */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Notifications</h4>
              <Button asChild size="sm" variant="ghost" className="crypto-button">
                <Link href="/dashboard/settings">
                  <HugeiconsIcon icon={Settings01Icon} className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            {project.notificationEmails?.length > 0 ? (
              <div className="space-y-2">
                {project.notificationEmails.map((email: string) => (
                  <div key={email} className="flex items-center gap-3 p-3 rounded-lg crypto-base">
                    <HugeiconsIcon icon={Mail01Icon} className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <HugeiconsIcon icon={Mail01Icon} className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">No email notifications</p>
                <Button asChild size="sm" className="crypto-button">
                  <Link href="/dashboard/settings">Add Email</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="crypto-base border-0 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
            <HugeiconsIcon icon={BookOpen01Icon} className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Resources</h3>
        </div>
        
        <div className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-between crypto-button">
            <a href="https://docs.Superlamp.dev/core" target="_blank" rel="noreferrer">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={BookOpen01Icon} className="w-4 h-4" />
                <span>Documentation</span>
              </div>
              <HugeiconsIcon icon={ArrowUpRightIcon} className="w-4 h-4" />
            </a>
          </Button>
          
          <Button asChild variant="outline" className="w-full justify-start crypto-button">
            <Link href="/dashboard/settings">
              <HugeiconsIcon icon={Settings01Icon} className="w-4 h-4 mr-2" />
              Project Settings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
