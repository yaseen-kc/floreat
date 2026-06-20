/**
 * Centralised React Query key factory for Job queries.
 *
 * Using a single factory keeps query keys consistent across hooks and makes
 * cache invalidation reliable: invalidating `jobKeys.lists()` matches every
 * paginated list query by prefix.
 */
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...jobKeys.lists(), { page, pageSize }] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
}
