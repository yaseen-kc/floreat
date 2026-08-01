import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuotationInput } from '@/schemas/quotation.schema'
import type { Quotation } from './getQuotation'
import { quotationKeys } from './queryKeys'

/** Payload for updating a quotation — partial of the canonical quotation create contract. */
export type UpdateQuotationPayload = Partial<CreateQuotationInput>

/** Variables accepted by the {@link useUpdateQuotation} mutation. */
export interface UpdateQuotationVariables {
  jobId: string
  payload: UpdateQuotationPayload
}

/**
 * Partially updates the quotation for a job via PUT /api/jobs/:jobId/quotation.
 * The backend validates the partial payload and returns the full updated quotation.
 * Requires a Clerk session token for authentication.
 */
export async function updateQuotation(
  token: string | null,
  jobId: string,
  payload: UpdateQuotationPayload,
): Promise<Quotation> {
  return await apiFetch(`/api/jobs/${jobId}/quotation`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's quotation. On success it invalidates both
 * the single-quotation detail (keyed by `jobId`) and every paginated quotations list.
 */
export function useUpdateQuotation() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateQuotationVariables) => {
      const token = await getToken()
      return updateQuotation(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() })
    },
  })
}
