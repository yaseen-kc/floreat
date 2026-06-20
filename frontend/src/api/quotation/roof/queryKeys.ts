/**
 * Centralised React Query key factory for Roof queries.
 *
 * Mirrors the Job key factory so cache invalidation stays consistent:
 * invalidating `roofKeys.lists()` matches every paginated list query by prefix,
 * and roof details are addressed by their owning `jobId` (roofs are 1:1 with jobs).
 */
export const roofKeys = {
  all: ['roofs'] as const,
  lists: () => [...roofKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...roofKeys.lists(), { page, pageSize }] as const,
  details: () => [...roofKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...roofKeys.details(), jobId] as const,
}
