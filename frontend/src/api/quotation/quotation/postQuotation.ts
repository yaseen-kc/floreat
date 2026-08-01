import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateQuotationInput } from '@/schemas/quotation.schema'
import type { Quotation } from './getQuotation'
import { quotationKeys } from './queryKeys'

/** Payload for creating/upserting a quotation — the canonical quotation request contract. */
export type CreateQuotationPayload = CreateQuotationInput

/** Variables accepted by the {@link useUpsertQuotation} mutation. */
export interface UpsertQuotationVariables {
  jobId: string
  payload: CreateQuotationPayload
}

/**
 * Creates or updates the quotation for a job via POST /api/jobs/:jobId/quotation.
 * The backend treats this as an upsert and returns the full quotation (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertQuotation(
  token: string | null,
  jobId: string,
  payload: CreateQuotationPayload,
): Promise<Quotation> {
  return await apiFetch(`/api/jobs/${jobId}/quotation`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's quotation. On success it invalidates both
 * the single-quotation detail (keyed by `jobId`) and every paginated quotations list.
 */
export function useUpsertQuotation() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertQuotationVariables) => {
      const token = await getToken()
      return upsertQuotation(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() })
    },
  })
}
