import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateRateInput } from '@floreat/shared/schemas'
import type { Rate } from './getRate'
import { rateKeys } from './queryKeys'
export type CreateRatePayload = CreateRateInput
export async function createRate(token: string | null, jobId: string, payload: CreateRatePayload): Promise<Rate> {
  return await apiFetch(`/api/jobs/${jobId}/rates`, token, { method: 'POST', body: JSON.stringify(payload) })
}
export function useCreateRate() {
  const { getToken } = useAuth(); const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: { jobId: string; payload: CreateRatePayload }) => createRate(await getToken(), jobId, payload),
    onSuccess: (_data, { jobId }) => { queryClient.invalidateQueries({ queryKey: rateKeys.lists(jobId) }) },
  })
}
