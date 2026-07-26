import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import { quantityCladdingKeys } from './queryKeys'

/**
 * Deletes the cladding section for a job via DELETE /api/jobs/:jobId/quantity/cladding.
 * The backend responds with 204 No Content. Requires a Clerk session token.
 */
export async function deleteQuantityCladding(token: string | null, jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/quantity/cladding`, token, { method: 'DELETE' })
}

/**
 * React Query hook for deleting a job's cladding section. On success invalidates
 * both the cladding detail and every paginated cladding list.
 */
export function useDeleteQuantityCladding() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken()
      return deleteQuantityCladding(token, jobId)
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: quantityCladdingKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quantityCladdingKeys.lists() })
    },
  })
}
