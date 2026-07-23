export const quantityStairKeys = {
  all: ['quantity-stairs'] as const,
  lists: () => [...quantityStairKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...quantityStairKeys.lists(), { page, pageSize }] as const,
  details: () => [...quantityStairKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...quantityStairKeys.details(), jobId] as const,
}
