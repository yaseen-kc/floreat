import { apiFetch } from '../../lib/api'

/** Shape of the authenticated user's profile returned by GET /api/me. */
export interface Me {
  id?: string
  email?: string
  firstName?: string | null
  lastName?: string | null
  [key: string]: unknown
}

/**
 * Fetches the currently authenticated user's profile from the backend.
 * Pass a Clerk session token (from `useAuth().getToken()`); the backend
 * verifies it and returns the user record.
 */
export async function fetchMe(token: string | null): Promise<Me> {
  return await apiFetch('/api/me', token)
}
