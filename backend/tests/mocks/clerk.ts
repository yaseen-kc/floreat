import { vi, beforeEach } from 'vitest'

export const mockGetAuth = vi.fn().mockReturnValue({ userId: 'test-user-id' })
export const mockGetUser = vi.fn()

vi.mock('@clerk/fastify', () => ({
  getAuth: (...args: any[]) => mockGetAuth(...args),
  clerkPlugin: async () => {},
  clerkClient: { users: { getUser: (...args: any[]) => mockGetUser(...args) } },
}))

beforeEach(() => {
  mockGetAuth.mockReturnValue({ userId: 'test-user-id' })
  mockGetUser.mockReset()
})
