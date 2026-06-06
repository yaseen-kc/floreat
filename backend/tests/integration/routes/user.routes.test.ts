import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth, mockGetUser } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeUser } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('User routes integration', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetAuth.mockReturnValueOnce({ userId: null })

    const res = await app.inject({ method: 'GET', url: '/api/me' })

    expect(res.statusCode).toBe(401)
  })

  it('returns existing user profile', async () => {
    const user = makeUser({ clerkId: 'test-user-id' })
    prismaMock.user.findUnique.mockResolvedValue(user as any)

    const res = await app.inject({ method: 'GET', url: '/api/me' })

    expect(res.statusCode).toBe(200)
    expect(res.json().email).toBe(user.email)
  })

  it('syncs new user from Clerk then returns profile', async () => {
    const user = makeUser({ clerkId: 'test-user-id' })
    prismaMock.user.findUnique
      .mockResolvedValueOnce(null) // syncUser: not found
      .mockResolvedValueOnce(user as any) // getMe: returns created user
    mockGetUser.mockResolvedValue({
      emailAddresses: [{ emailAddress: user.email }],
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    })
    prismaMock.user.create.mockResolvedValue(user as any)

    const res = await app.inject({ method: 'GET', url: '/api/me' })

    expect(res.statusCode).toBe(200)
    expect(prismaMock.user.create).toHaveBeenCalled()
  })
})
