import { describe, it, expect } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth, mockGetUser } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeUser } from '../../helpers/factories.js'
import Fastify from 'fastify'
import { authMiddleware } from '../../../middlewares/auth.js'
import { syncUser } from '../../../middlewares/sync-user.js'

async function buildMinimalApp() {
  const app = Fastify()
  app.decorateRequest('userId', '')
  app.get('/test', { preHandler: [authMiddleware, syncUser] }, (req, reply) => {
    reply.send({ ok: true })
  })
  await app.ready()
  return app
}

describe('syncUser middleware', () => {
  it('skips creation when user already exists', async () => {
    const user = makeUser({ clerkId: 'test-user-id' })
    prismaMock.user.findUnique.mockResolvedValue(user as any)
    const app = await buildMinimalApp()

    const res = await app.inject({ method: 'GET', url: '/test' })

    expect(res.statusCode).toBe(200)
    expect(prismaMock.user.create).not.toHaveBeenCalled()
  })

  it('creates user when not found in DB', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    mockGetUser.mockResolvedValue({
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'John',
      lastName: 'Doe',
      imageUrl: 'https://img.clerk.com/avatar.png',
    })
    prismaMock.user.create.mockResolvedValue({} as any)
    const app = await buildMinimalApp()

    const res = await app.inject({ method: 'GET', url: '/test' })

    expect(res.statusCode).toBe(200)
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        clerkId: 'test-user-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        imageUrl: 'https://img.clerk.com/avatar.png',
      },
    })
  })

  it('uses empty string when no email addresses exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    mockGetUser.mockResolvedValue({
      emailAddresses: [],
      firstName: 'No',
      lastName: 'Email',
      imageUrl: null,
    })
    prismaMock.user.create.mockResolvedValue({} as any)
    const app = await buildMinimalApp()

    const res = await app.inject({ method: 'GET', url: '/test' })

    expect(res.statusCode).toBe(200)
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        clerkId: 'test-user-id',
        email: '',
        firstName: 'No',
        lastName: 'Email',
        imageUrl: null,
      },
    })
  })
})
