export const amountKeys = {
  all: ['amounts'] as const,
  lists: () => [...amountKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...amountKeys.lists(), { page, pageSize }] as const,
  details: () => [...amountKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...amountKeys.details(), jobId] as const,
}
