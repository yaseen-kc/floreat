export const quantityPebRoofKeys = {
  all: ['quantity-peb-roofs'] as const,
  lists: () => [...quantityPebRoofKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...quantityPebRoofKeys.lists(), { page, pageSize }] as const,
  details: () => [...quantityPebRoofKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...quantityPebRoofKeys.details(), jobId] as const,
}
