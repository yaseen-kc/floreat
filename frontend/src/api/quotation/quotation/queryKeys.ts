/**
 * Centralised React Query key factory for Quotation queries.
 *
 * Mirrors the Load key factory: cache invalidation is consistent,
 * details are keyed by `jobId` (quotations are 1:1 with jobs).
 */
export const quotationKeys = {
  all: ['quotations'] as const,
  lists: () => [...quotationKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...quotationKeys.lists(), { page, pageSize }] as const,
  details: () => [...quotationKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...quotationKeys.details(), jobId] as const,
}
