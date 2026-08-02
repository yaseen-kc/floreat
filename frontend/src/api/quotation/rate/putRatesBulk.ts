import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { BulkRateInput } from '@floreat/shared/schemas'
import type { Rate } from './getRate'
import { rateKeys } from './queryKeys'

export type BulkRatePayload = BulkRateInput

export async function replaceRates(token: string | null, jobId: string, payload: BulkRatePayload): Promise<Rate[]> {
  return await apiFetch(`/api/jobs/${jobId}/rates/bulk`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function useReplaceRates() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: { jobId: string; payload: BulkRatePayload }) =>
      replaceRates(await getToken(), jobId, payload),
    onSuccess: (data, { jobId }) => {
      queryClient.setQueryData(rateKeys.list(jobId, 1, 100), { data, total: data.length, page: 1, pageSize: 100 })
      queryClient.invalidateQueries({ queryKey: rateKeys.lists(jobId) })
    },
  })
}
