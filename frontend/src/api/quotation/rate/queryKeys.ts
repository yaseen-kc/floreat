/**
 * Centralised React Query key factory for Rate master-data queries.
 *
 * Rate is a top-level master table (not job-scoped), so details are addressed
 * by their own `id` rather than a `jobId`. Invalidating `rateKeys.lists()`
 * matches every paginated list query by prefix, keeping the `/rates` listing in
 * sync after any create/update/delete.
 */
export const rateKeys = {
  all: ['rates'] as const,
  lists: () => [...rateKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...rateKeys.lists(), { page, pageSize }] as const,
  details: () => [...rateKeys.all, 'detail'] as const,
  detail: (id: string) => [...rateKeys.details(), id] as const,
}
