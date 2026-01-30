'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  Key01Icon,
  WebhookIcon,
  ArrowUpRightIcon,
  CheckmarkCircle01Icon,
  Activity01Icon,
  ChartIcon,
  CodeIcon,
  PlayIcon
} from '@hugeicons/core-free-icons'
import Link from 'next/link'
import type { ProjectDetails } from '@/types/project'

interface IntegrationStatusSectionProps {
  project: ProjectDetails
}

export function IntegrationStatusSection({ project }: IntegrationStatusSectionProps) {
  const hasApiKeys = (project.apiTokens ?? []).length > 0;
  const hasWebhooks = (project.webhookEndpoints ?? []).length > 0;

  const integrationSteps = [
    {
      id: 'api',
      title: 'API Configuration',
      description: 'Generate secure API keys to authenticate your payment requests.\nEnable seamless integration with your application backend.',
      completed: hasApiKeys,
      icon: Key01Icon,
      action: 'Configure API',
      href: '/dashboard/settings'
    },
    {
      id: 'webhook',
      title: 'Webhook Endpoints',
      description: 'Set up real-time notifications for payment events and status updates.\nKeep your application synchronized with transaction changes.',
      completed: hasWebhooks,
      icon: WebhookIcon,
      action: 'Setup Webhooks',
      href: '/dashboard/settings'
    }
  ];

  const completedSteps = integrationSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / integrationSteps.length) * 100;

  return (
    <div className="space-y-8">
      {/* Show Test Integration first if 100% complete, otherwise show setup */}
      {progressPercentage === 100 ? (
        /* Quick Actions Section - Show first when complete */
        hasApiKeys && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="crypto-base p-6 rounded-xl">
            <div className="mb-4">
              <HugeiconsIcon icon={CodeIcon} className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold mb-2">View Billing</h4>
              <p className="text-xs text-muted-foreground">Manage your subscription and billing</p>
            </div>
            <Button asChild size="sm" className="crypto-button w-full">
              <a href="/checkout" target="_blank" rel="noreferrer">
                <HugeiconsIcon icon={ArrowUpRightIcon} className="w-4 h-4 mr-2" />
                View Billing
              </a>
            </Button>
          </div>

          {hasWebhooks && (
            <div className="crypto-base p-6 rounded-xl">
              <div className="mb-4">
                <HugeiconsIcon icon={WebhookIcon} className="w-8 h-8 text-purple-500 mb-3" />
                <h4 className="font-semibold mb-2">Test Webhook</h4>
                <p className="text-xs text-muted-foreground">Send a test event to your endpoint</p>
              </div>
              <Button asChild size="sm" variant="outline" className="crypto-button w-full">
                <Link href="/dashboard/settings">
                  <HugeiconsIcon icon={ArrowUpRightIcon} className="w-4 h-4 mr-2" />
                  Configure Webhooks
                </Link>
              </Button>
            </div>
          )}

          <div className="crypto-base p-6 rounded-xl">
            <div className="mb-4">
              <HugeiconsIcon icon={Activity01Icon} className="w-8 h-8 text-green-500 mb-3" />
              <h4 className="font-semibold mb-2">View Events</h4>
              <p className="text-xs text-muted-foreground">Browse payment and transaction events</p>
            </div>
            <Button asChild size="sm" variant="outline" className="crypto-button w-full">
              <Link href="/dashboard/events">
                <HugeiconsIcon icon={Activity01Icon} className="w-4 h-4 mr-2" />
                View Events
              </Link>
            </Button>
          </div>

          <div className="crypto-base p-6 rounded-xl">
            <div className="mb-4">
              <HugeiconsIcon icon={ChartIcon} className="w-8 h-8 text-orange-500 mb-3" />
              <h4 className="font-semibold mb-2">View Stats</h4>
              <p className="text-xs text-muted-foreground">Check analytics and performance metrics</p>
            </div>
            <Button asChild size="sm" variant="outline" className="crypto-button w-full">
              <Link href="/dashboard/home">
                <HugeiconsIcon icon={ChartIcon} className="w-4 h-4 mr-2" />
                View Stats
              </Link>
            </Button>
          </div>
        </div>
        )
      ) : (
        /* Integration Setup Section - Show when not 100% complete */
        <div className="crypto-base border-0 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Integration Setup</h3>
              <p className="text-muted-foreground">
                {completedSteps} of {integrationSteps.length} steps completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-1">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>

          {/* Integration Steps Grid */}
          <div className="grid grid-cols-1 gap-6">
            {integrationSteps.map((step) => (
              <div
                key={step.id}
              className={`group relative p-8 rounded-xl ${
                step.completed
                  ? 'bg-green-500/5'
                  : 'bg-background/50'
              }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-xl ${
                    step.completed 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-muted/20 text-muted-foreground'
                  }`}>
                    {step.completed ? (
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-8 h-8" />
                    ) : (
                      <HugeiconsIcon icon={step.icon} className="w-8 h-8" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-lg">{step.title}</h4>
                      {step.completed && (
                        <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                          Complete
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                      {step.description}
                    </p>
                    
                    {!step.completed && (
                      <Button asChild size="sm" variant="outline" className="crypto-button">
                        <Link href={step.href}>
                          {step.action}
                          <HugeiconsIcon icon={ArrowUpRightIcon} className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Section - Show after setup if not 100% complete */}
      {progressPercentage !== 100 && hasApiKeys && (
        <div className="crypto-base border-0 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <HugeiconsIcon icon={PlayIcon} className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">Access key features and test your integration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="crypto-base p-6 rounded-xl">
              <div className="mb-4">
                <HugeiconsIcon icon={CodeIcon} className="w-8 h-8 text-blue-500 mb-3" />
                <h4 className="font-semibold mb-2">View Billing</h4>
                <p className="text-xs text-muted-foreground">Manage your subscription and billing</p>
              </div>
              <Button asChild size="sm" className="crypto-button w-full">
                <a href="/checkout" target="_blank" rel="noreferrer">
                  <HugeiconsIcon icon={ArrowUpRightIcon} className="w-4 h-4 mr-2" />
                  View Billing
                </a>
              </Button>
            </div>

            {hasWebhooks && (
              <div className="crypto-base p-6 rounded-xl">
                <div className="mb-4">
                  <HugeiconsIcon icon={WebhookIcon} className="w-8 h-8 text-purple-500 mb-3" />
                  <h4 className="font-semibold mb-2">Test Webhook</h4>
                  <p className="text-xs text-muted-foreground">Send a test event to your endpoint</p>
                </div>
                <Button asChild size="sm" variant="outline" className="crypto-button w-full">
                  <Link href="/dashboard/settings">
                    <HugeiconsIcon icon={ArrowUpRightIcon} className="w-4 h-4 mr-2" />
                    Configure Webhooks
                  </Link>
                </Button>
              </div>
            )}

            <div className="crypto-base p-6 rounded-xl">
              <div className="mb-4">
                <HugeiconsIcon icon={Activity01Icon} className="w-8 h-8 text-green-500 mb-3" />
                <h4 className="font-semibold mb-2">View Events</h4>
                <p className="text-xs text-muted-foreground">Browse payment and transaction events</p>
              </div>
              <Button asChild size="sm" variant="outline" className="crypto-button w-full">
                <Link href="/dashboard/events">
                  <HugeiconsIcon icon={Activity01Icon} className="w-4 h-4 mr-2" />
                  View Events
                </Link>
              </Button>
            </div>

            <div className="crypto-base p-6 rounded-xl">
              <div className="mb-4">
                <HugeiconsIcon icon={ChartIcon} className="w-8 h-8 text-orange-500 mb-3" />
                <h4 className="font-semibold mb-2">View Stats</h4>
                <p className="text-xs text-muted-foreground">Check analytics and performance metrics</p>
              </div>
              <Button asChild size="sm" variant="outline" className="crypto-button w-full">
                <Link href="/dashboard/home">
                  <HugeiconsIcon icon={ChartIcon} className="w-4 h-4 mr-2" />
                  View Stats
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
