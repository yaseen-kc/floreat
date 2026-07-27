import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quantityMezzanineKeys } from './queryKeys'

/**
 * Deletes the mezzanine section for a job via DELETE /api/jobs/:jobId/quantity/mezzanine.
 * The backend responds with 204 No Content. Requires a Clerk session token.
 */
export async function deleteQuantityMezzanine(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/quantity/mezzanine`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's mezzanine section. On success invalidates
 * both the mezzanine detail and every paginated list.
 */
export function useDeleteQuantityMezzanine() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteQuantityMezzanine(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: quantityMezzanineKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityMezzanineKeys.lists() })
    },
  })
}
