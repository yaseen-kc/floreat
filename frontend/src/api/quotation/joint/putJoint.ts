import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/react'
import { apiFetch } from '@/lib/api'
import type { CreateJointInput } from '@/schemas/joint.schema'
import type { Joint } from './getJoint'
import { jointKeys } from './queryKeys'

/** Payload for updating a joint — partial of the canonical joint create contract. */
export type UpdateJointPayload = Partial<CreateJointInput>

/** Variables accepted by the {@link useUpdateJoint} mutation. */
export interface UpdateJointVariables {
  jobId: string
  payload: UpdateJointPayload
}

/**
 * Partially updates the joint for a job via PUT /api/jobs/:jobId/joint.
 * The backend validates the partial payload and returns the full updated joint.
 * Requires a Clerk session token for authentication.
 */
export async function updateJoint(
  token: string | null,
  jobId: string,
  payload: UpdateJointPayload,
): Promise<Joint> {
  return await apiFetch(`/api/jobs/${jobId}/joint`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

/**
 * React Query hook for updating a job's joint. On success it invalidates both
 * the single-joint detail (keyed by `jobId`) and every paginated joints list,
 * so the `/joints` listing and the job's joint view stay in sync.
 */
export function useUpdateJoint() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, payload }: UpdateJointVariables) => {
      const token = await getToken()
      return updateJoint(token, jobId, payload)
    },
    onSuccess: (_data, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jointKeys.detail(jobId) })
      queryClient.invalidateQueries({ queryKey: jointKeys.lists() })
    },
  })
}
