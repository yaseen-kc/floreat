/**
 * Centralised React Query key factory for Canopy queries.
 *
 * Mirrors the Roof key factory so cache invalidation stays consistent:
 * invalidating `canopyKeys.lists()` matches every paginated list query by
 * prefix, and canopy details are addressed by their owning `jobId` (canopies
 * are 1:1 with jobs).
 */
export const canopyKeys = {
  all: ['canopies'] as const,
  lists: () => [...canopyKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...canopyKeys.lists(), { page, pageSize }] as const,
  details: () => [...canopyKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...canopyKeys.details(), jobId] as const,
}
