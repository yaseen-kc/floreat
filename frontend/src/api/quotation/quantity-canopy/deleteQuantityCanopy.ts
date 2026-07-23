import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quantityCanopyKeys } from './queryKeys'

/**
 * Deletes the canopy section for a job via DELETE /api/jobs/:jobId/quantity/canopy.
 * The backend responds with 204 No Content. Requires a Clerk session token.
 */
export async function deleteQuantityCanopy(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/quantity/canopy`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's canopy section. On success invalidates
 * both the canopy detail and every paginated canopy list.
 */
export function useDeleteQuantityCanopy() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteQuantityCanopy(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: quantityCanopyKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityCanopyKeys.lists() })
    },
  })
}
