import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { mockGetUser } from '../../mocks/clerk.js'
import { makeUser } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('user controller - GET /api/me', () => {
  it('returns 200 with user data', async () => {
    const user = makeUser({ clerkId: 'test-user-id' })
    // syncUser check + getMe query
    prismaMock.user.findUnique.mockResolvedValue(user as any)

    const res = await app.inject({ method: 'GET', url: '/api/me' })

    expect(res.statusCode).toBe(200)
    expect(res.json().email).toBe(user.email)
  })

  it('returns null when user not in DB and sync creates it', async () => {
    // syncUser: findUnique returns null (triggers create)
    prismaMock.user.findUnique
      .mockResolvedValueOnce(null) // syncUser check
      .mockResolvedValueOnce(null) // getMe query
    mockGetUser.mockResolvedValue({
      emailAddresses: [{ emailAddress: 'new@example.com' }],
      firstName: 'New',
      lastName: 'User',
      imageUrl: 'https://img.clerk.com/new.png',
    })
    prismaMock.user.create.mockResolvedValue({} as any)

    const res = await app.inject({ method: 'GET', url: '/api/me' })

    expect(res.statusCode).toBe(200)
  })
})
