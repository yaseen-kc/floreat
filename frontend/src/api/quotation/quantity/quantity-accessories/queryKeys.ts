export const quantityAccessoriesKeys = {
  all: ['quantity-accessories'] as const,
  lists: () => [...quantityAccessoriesKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...quantityAccessoriesKeys.lists(), { page, pageSize }] as const,
  details: () => [...quantityAccessoriesKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...quantityAccessoriesKeys.details(), jobId] as const,
}
