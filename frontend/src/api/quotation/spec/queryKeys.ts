/**
 * Centralised React Query key factory for Spec queries.
 *
 * Mirrors the Canopy key factory so cache invalidation stays consistent:
 * invalidating `specKeys.lists()` matches every paginated list query by prefix,
 * and spec details are addressed by their owning `jobId` (specs are 1:1 with
 * jobs).
 */
export const specKeys = {
  all: ['specs'] as const,
  lists: () => [...specKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...specKeys.lists(), { page, pageSize }] as const,
  details: () => [...specKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...specKeys.details(), jobId] as const,
}
