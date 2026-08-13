import { useAuth } from '@clerk/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AppRole, UserInvitationStatus, UserStatus } from '@floreat/shared/schemas'
import { apiFetch } from '@/lib/api'

export type ManagedUser = { id: string; clerkId: string; email: string; firstName: string | null; lastName: string | null; role: AppRole; status: UserStatus; createdAt: string }
export type UserInvitation = { id: string; email: string; role: AppRole; status: UserInvitationStatus; createdAt: string; expiresAt: string | null }
export type UserListResponse = { users: ManagedUser[]; invitations: UserInvitation[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }
export type UserListParams = { page?: number; pageSize?: number; search?: string; role?: AppRole; status?: UserStatus; invitationStatus?: UserInvitationStatus }
export const userQueryKeys = { all: ['users'] as const, list: (params: UserListParams) => ['users', 'list', params] as const }

function queryString(params: UserListParams) { return new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== '').map(([key, value]) => [key, String(value)])).toString() }
async function usersRequest<T>(path: string, token: string | null, options?: RequestInit): Promise<T> {
  const headers = options?.body === undefined ? options?.headers : { 'Content-Type': 'application/json', ...options?.headers }
  return await apiFetch(path, token, { ...options, ...(headers ? { headers } : {}) }) as T
}

export function useUsers(params: UserListParams) {
  const { getToken } = useAuth()
  return useQuery({ queryKey: userQueryKeys.list(params), queryFn: async () => usersRequest<UserListResponse>(`/api/users?${queryString(params)}`, await getToken()) })
}
function useUserMutation<T>(path: string | ((input: T) => string), method: string, body?: (input: T) => unknown) {
  const { getToken } = useAuth(); const client = useQueryClient()
  return useMutation({ mutationFn: async (input: T) => usersRequest(path instanceof Function ? path(input) : path, await getToken(), { method, ...(body ? { body: JSON.stringify(body(input)) } : {}) }), onSuccess: () => client.invalidateQueries({ queryKey: userQueryKeys.all }) })
}
export function useInviteUser() { return useUserMutation<{ email: string; role: AppRole }>('/api/users/invitations', 'POST', (input) => input) }
export function useAssignUserRole() { return useUserMutation<{ clerkId: string; role: AppRole }>((input) => `/api/users/${input.clerkId}/role`, 'PATCH', (input) => ({ role: input.role })) }
export function useResendInvitation() { return useUserMutation<string>((id) => `/api/users/invitations/${id}/resend`, 'POST') }
export function useRevokeInvitation() { return useUserMutation<string>((id) => `/api/users/invitations/${id}/revoke`, 'POST') }
export function useDeactivateUser() { return useUserMutation<string>((id) => `/api/users/${id}/deactivate`, 'POST') }
export function useReactivateUser() { return useUserMutation<string>((id) => `/api/users/${id}/reactivate`, 'POST') }
