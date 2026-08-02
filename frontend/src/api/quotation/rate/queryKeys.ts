/** React Query keys for job-owned rates. */
export const rateKeys = {
  all: ['rates'] as const,
  lists: (jobId: string) => [...rateKeys.all, jobId, 'list'] as const,
  list: (jobId: string, page: number, pageSize: number) => [...rateKeys.lists(jobId), { page, pageSize }] as const,
  details: (jobId: string) => [...rateKeys.all, jobId, 'detail'] as const,
  detail: (jobId: string, id: string) => [...rateKeys.details(jobId), id] as const,
}
