import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { UpdateRateInput } from '@floreat/shared/schemas'
import type { Rate } from './getRate'
import { rateKeys } from './queryKeys'
export type UpdateRatePayload = UpdateRateInput
export interface UpdateRateVariables { jobId: string; id: string; payload: UpdateRatePayload }
export async function updateRate(token: string | null, jobId: string, id: string, payload: UpdateRatePayload): Promise<Rate> {
  return await apiFetch(`/api/jobs/${jobId}/rates/${id}`, token, { method: 'PUT', body: JSON.stringify(payload) })
}
export function useUpdateRate() {
  const { getToken } = useAuth(); const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, id, payload }: UpdateRateVariables) => updateRate(await getToken(), jobId, id, payload),
    onSuccess: (_data, { jobId, id }) => {
      queryClient.invalidateQueries({ queryKey: rateKeys.detail(jobId, id) })
      queryClient.invalidateQueries({ queryKey: rateKeys.lists(jobId) })
    },
  })
}
