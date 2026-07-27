export const quantityCladdingKeys = {
  all: ['quantity-claddings'] as const,
  lists: () => [...quantityCladdingKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...quantityCladdingKeys.lists(), { page, pageSize }] as const,
  details: () => [...quantityCladdingKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...quantityCladdingKeys.details(), jobId] as const,
}
