/**
 * Centralised React Query key factory for Accessories queries.
 *
 * Mirrors the Canopy/Roof key factories so cache invalidation stays consistent:
 * invalidating `accessoriesKeys.lists()` matches every paginated list query by
 * prefix, and accessories details are addressed by their owning `jobId`
 * (accessories are 1:1 with jobs).
 */
export const accessoriesKeys = {
  all: ['accessories'] as const,
  lists: () => [...accessoriesKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...accessoriesKeys.lists(), { page, pageSize }] as const,
  details: () => [...accessoriesKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...accessoriesKeys.details(), jobId] as const,
}
