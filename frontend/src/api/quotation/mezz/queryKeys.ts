/**
 * Centralised React Query key factory for Mezzanine queries.
 *
 * Mirrors the Roof key factory so cache invalidation stays consistent:
 * invalidating `mezzanineKeys.lists()` matches every paginated list query by
 * prefix, and mezzanine details are addressed by their owning `jobId`
 * (mezzanines are 1:1 with jobs).
 */
export const mezzanineKeys = {
  all: ['mezzanines'] as const,
  lists: () => [...mezzanineKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...mezzanineKeys.lists(), { page, pageSize }] as const,
  details: () => [...mezzanineKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...mezzanineKeys.details(), jobId] as const,
}
