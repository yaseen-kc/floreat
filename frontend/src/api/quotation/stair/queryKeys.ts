/**
 * Centralised React Query key factory for Stair queries.
 *
 * Mirrors the Roof/Mezzanine key factories so cache invalidation stays
 * consistent: invalidating `stairKeys.lists()` matches every paginated list
 * query by prefix, and stair details are addressed by their owning `jobId`
 * (stairs are 1:1 with jobs).
 */
export const stairKeys = {
  all: ['stairs'] as const,
  lists: () => [...stairKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...stairKeys.lists(), { page, pageSize }] as const,
  details: () => [...stairKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...stairKeys.details(), jobId] as const,
}
