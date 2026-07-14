import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateJointInput } from '@/schemas/joint.schema'
import type { Joint } from './getJoint'
import { jointKeys } from './queryKeys'

/** Payload for creating/upserting a joint — the canonical joint request contract. */
export type CreateJointPayload = CreateJointInput

/** Variables accepted by the {@link useUpsertJoint} mutation. */
export interface UpsertJointVariables {
  jobId: string
  payload: CreateJointPayload
}

/**
 * Creates or updates the joint for a job via POST /api/jobs/:jobId/joint.
 * The backend treats this as an upsert and returns the full joint (status 200).
 * Requires a Clerk session token for authentication.
 */
export async function upsertJoint(
  token: string | null,
  jobId: string,
  payload: CreateJointPayload,
): Promise<Joint> {
  return await apiFetch(`/api/jobs/${jobId}/joint`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for upserting a job's joint. On success it invalidates both
 * the single-joint detail (keyed by `jobId`) and every paginated joints list,
 * so the `/joints` listing and the job's joint view stay in sync.
 */
export function useUpsertJoint() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpsertJointVariables) => {
      const token = await getToken()
      return upsertJoint(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jointKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: jointKeys.lists() })
    },
  })
}
