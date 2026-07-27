import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quantityAdditionalBoltsKeys } from './queryKeys'

/**
 * Deletes the additionalBolts section for a job via DELETE /api/jobs/:jobId/quantity/additional-bolts.
 * The backend responds with 204 No Content. Requires a Clerk session token.
 */
export async function deleteQuantityAdditionalBolts(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/quantity/additional-bolts`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's additionalBolts section. On success invalidates
 * both the additionalBolts detail and every paginated list.
 */
export function useDeleteQuantityAdditionalBolts() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteQuantityAdditionalBolts(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: quantityAdditionalBoltsKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityAdditionalBoltsKeys.lists() })
    },
  })
}
