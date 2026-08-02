/**
 * Centralised React Query key factory for Quantity queries.
 *
 * Invalidating `quantityKeys.lists()` matches every paginated quantity list by
 * prefix, and quantity details are addressed by their owning `jobId`
 * (quantities are 1:1 with jobs).
 */
export const quantityKeys = {
  all: ['quantities'] as const,
  lists: () => [...quantityKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...quantityKeys.lists(), { page, pageSize }] as const,
  details: () => [...quantityKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...quantityKeys.details(), jobId] as const,
}
