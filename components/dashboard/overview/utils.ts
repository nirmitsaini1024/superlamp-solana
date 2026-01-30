import type { ProjectDetails } from '@/types/project'

export const getProjectMetrics = (project: ProjectDetails) => {
  const totalRequests = (project.apiTokens ?? [])
    .reduce((sum, t) => sum + (t.requestCount ?? 0), 0);
  
  const activeApiKeys = (project.apiTokens ?? []).filter(t => t.status === 'ACTIVE').length;
  const activeWebhooks = (project.webhookEndpoints ?? []).filter(w => w.status === 'ACTIVE').length;
  
  const lastApiUse = (project.apiTokens ?? [])
    .map(t => t.lastUsedAt ? new Date(t.lastUsedAt).getTime() : 0)
    .reduce((a, b) => Math.max(a, b), 0);
  
  const lastWebhookHit = (project.webhookEndpoints ?? [])
    .map(w => w.lastTimeHit ? new Date(w.lastTimeHit).getTime() : 0)
    .reduce((a, b) => Math.max(a, b), 0);

  return {
    totalRequests,
    activeApiKeys,
    activeWebhooks,
    lastApiUse,
    lastWebhookHit,
    hasActivity: lastApiUse > 0 || lastWebhookHit > 0
  };
};
