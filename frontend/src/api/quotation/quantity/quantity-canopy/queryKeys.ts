export const quantityCanopyKeys = {
  all: ['quantity-canopies'] as const,
  lists: () => [...quantityCanopyKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...quantityCanopyKeys.lists(), { page, pageSize }] as const,
  details: () => [...quantityCanopyKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...quantityCanopyKeys.details(), jobId] as const,
}
