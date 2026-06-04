import { describe, it, expect } from 'vitest'
import '../../mocks/clerk.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import Fastify from 'fastify'
import { authMiddleware } from '../../../middlewares/auth.js'

async function buildMinimalApp() {
  const app = Fastify()
  app.decorateRequest('userId', '')
  app.get('/test', { preHandler: [authMiddleware] }, (req, reply) => {
    reply.send({ userId: req.userId })
  })
  await app.ready()
  return app
}

describe('authMiddleware', () => {
  it('sets userId and allows request when authenticated', async () => {
    mockGetAuth.mockReturnValue({ userId: 'user-123' })
    const app = await buildMinimalApp()

    const res = await app.inject({ method: 'GET', url: '/test' })

    expect(res.statusCode).toBe(200)
    expect(res.json().userId).toBe('user-123')
  })

  it('returns 401 when not authenticated', async () => {
    mockGetAuth.mockReturnValue({ userId: null })
    const app = await buildMinimalApp()

    const res = await app.inject({ method: 'GET', url: '/test' })

    expect(res.statusCode).toBe(401)
    expect(res.json().error).toBe('Unauthorized')
  })
})
