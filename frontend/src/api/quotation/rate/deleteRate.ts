import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { rateKeys } from './queryKeys'
export async function deleteRate(token: string | null, jobId: string, id: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/rates/${id}`, token, { method: 'DELETE' })
}
export function useDeleteRate() {
  const { getToken } = useAuth(); const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, id }: { jobId: string; id: string }) => deleteRate(await getToken(), jobId, id),
    onSuccess: (_data, { jobId, id }) => {
      queryClient.invalidateQueries({ queryKey: rateKeys.detail(jobId, id) })
      queryClient.invalidateQueries({ queryKey: rateKeys.lists(jobId) })
    },
  })
}
