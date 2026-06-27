/**
 * Centralised React Query key factory for Load queries.
 *
 * Mirrors the Roof key factory so cache invalidation stays consistent:
 * invalidating `loadKeys.lists()` matches every paginated list query by prefix,
 * and load details are addressed by their owning `jobId` (loads are 1:1 with jobs).
 */
export const loadKeys = {
  all: ['loads'] as const,
  lists: () => [...loadKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...loadKeys.lists(), { page, pageSize }] as const,
  details: () => [...loadKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...loadKeys.details(), jobId] as const,
}
