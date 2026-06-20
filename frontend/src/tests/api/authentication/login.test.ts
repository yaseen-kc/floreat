import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the low-level fetch wrapper so we can assert how fetchMe uses it.
vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/lib/api'
import { fetchMe } from '@/api/authentication/login'

const mockedApiFetch = vi.mocked(apiFetch)

describe('fetchMe', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('requests /api/me with the provided token and returns the profile', async () => {
    const profile = { id: 'user_1', firstName: 'Ada', email: 'ada@example.com' }
    mockedApiFetch.mockResolvedValueOnce(profile)

    const result = await fetchMe('session-token')

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/me', 'session-token')
    expect(result).toEqual(profile)
  })

  it('forwards a null token (unauthenticated request)', async () => {
    mockedApiFetch.mockResolvedValueOnce({})

    await fetchMe(null)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/me', null)
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 401'))

    await expect(fetchMe('bad-token')).rejects.toThrow('API error: 401')
  })
})
