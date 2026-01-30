'use client'

import { useSelectedProjectStore } from '@/store/projectStore'
import { ModeToggle } from '@/components/ui/theme-toggle'
import { useProjectFetchDetails } from '@/hooks/projects/useProjectDetailsFetch'
import { ProjectStatsGrid } from './project-stats-grid'
import { IntegrationStatusSection } from './integration-status-section'
import { ProjectInfoCards } from './project-info-cards'
import { OverviewSkeleton } from './overview-skeleton'
import { redirect } from 'next/navigation'

export default function OverviewPage() {

  const selectedProject = useSelectedProjectStore(s => s.selectedProject);
  const { data: project, isLoading } = useProjectFetchDetails(selectedProject?.id || '');

  // Show skeleton when no project is selected or when loading
  if (!selectedProject || isLoading) {
    return <OverviewSkeleton />;
  }

  if(!project?.user.walletAddress){
    redirect('/verify')
}

  return (
    <div className="min-h-screen rounded-full bg-background p-8">
      {/* Header */}
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            {project?.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor your integration progress and project metrics
          </p>
        </div>
        <div className="gap-4 flex items-center">
          {/* <Environment /> */}
          <ModeToggle />
        </div>
      </div>

      <div className="space-y-12">
        {/* Stats Grid */}
        {project && <ProjectStatsGrid project={project} walletAddress={project?.user?.walletAddress || undefined} />}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content - Integration & Testing */}
          <div className="xl:col-span-3">
            {project && <IntegrationStatusSection project={project} />}
          </div>

          {/* Sidebar - Project Info */}
          <div className="xl:col-span-1">
            {project && <ProjectInfoCards project={project} />}
          </div>
        </div>
      </div>
    </div>
  )
}