export const quantityAdditionalBoltsKeys = {
  all: ['quantity-additional-bolts'] as const,
  lists: () => [...quantityAdditionalBoltsKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...quantityAdditionalBoltsKeys.lists(), { page, pageSize }] as const,
  details: () => [...quantityAdditionalBoltsKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...quantityAdditionalBoltsKeys.details(), jobId] as const,
}
