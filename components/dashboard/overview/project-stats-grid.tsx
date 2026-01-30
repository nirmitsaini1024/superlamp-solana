'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { 
  Activity01Icon,
  Key01Icon,
  WebhookIcon,
  Wallet01Icon
} from '@hugeicons/core-free-icons'
import type { ProjectDetails } from '@/types/project'
import { getProjectMetrics } from './utils'

interface WalletAddressDisplayProps {
  walletAddress?: string
}

function WalletAddressDisplay({ walletAddress }: WalletAddressDisplayProps) {
  return <>{walletAddress?.slice(0,6)}...{walletAddress?.slice(-6)}</>
}

interface ProjectStatsGridProps {
  project: ProjectDetails
  walletAddress?: string
}

export function ProjectStatsGrid({ project, walletAddress }: ProjectStatsGridProps) {
  const metrics = getProjectMetrics(project);
  
  const stats = [
    {
      title: "Total Requests",
      value: metrics.totalRequests.toLocaleString(),
      icon: Activity01Icon,
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500"
    },
    {
      title: "Active API Keys",
      value: metrics.activeApiKeys,
      icon: Key01Icon,
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500"
    },
    {
      title: "Active Webhooks", 
      value: metrics.activeWebhooks,
      icon: WebhookIcon,
      color: "from-purple-500/20 to-violet-500/20",
      iconColor: "text-purple-500"
    },
    {
      title: "Connected Wallet",
      value: <WalletAddressDisplay walletAddress={walletAddress} />,
      icon: Wallet01Icon,
      color: "from-orange-500/20 to-amber-500/20",
      iconColor: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="group">
          <div className={`crypto-glass-static border-0 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br ${stat.color}`}>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`rounded-xl bg-background/10 backdrop-blur-sm ${stat.iconColor}`}>
                  <HugeiconsIcon icon={stat.icon} className="w-6 h-6" />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
