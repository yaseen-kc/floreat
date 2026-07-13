/**
 * Centralised React Query key factory for Joint queries.
 *
 * Mirrors the Canopy key factory so cache invalidation stays consistent:
 * invalidating `jointKeys.lists()` matches every paginated list query by
 * prefix, and joint details are addressed by their owning `jobId` (joints
 * are 1:1 with jobs).
 */
export const jointKeys = {
  all: ['joints'] as const,
  lists: () => [...jointKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...jointKeys.lists(), { page, pageSize }] as const,
  details: () => [...jointKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...jointKeys.details(), jobId] as const,
}
