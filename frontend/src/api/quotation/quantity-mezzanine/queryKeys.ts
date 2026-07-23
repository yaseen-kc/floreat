export const quantityMezzanineKeys = {
  all: ['quantity-mezzanines'] as const,
  lists: () => [...quantityMezzanineKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...quantityMezzanineKeys.lists(), { page, pageSize }] as const,
  details: () => [...quantityMezzanineKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...quantityMezzanineKeys.details(), jobId] as const,
}
