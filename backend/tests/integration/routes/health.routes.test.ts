import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('Health routes integration', () => {
  describe('public access', () => {
    it('is reachable without authentication (not 401)', async () => {
      // No signed-in user configured; the route must still respond.
      mockGetAuth.mockReturnValueOnce({ userId: null })
      prismaMock.$queryRaw.mockResolvedValue([{ '?column?': 1 }] as any)

      const res = await app.inject({ method: 'GET', url: '/api/health' })

      expect(res.statusCode).not.toBe(401)
      expect(res.statusCode).toBe(200)
    })
  })

  describe('GET /api/health', () => {
    it('returns 200 with db up when the database is reachable', async () => {
      prismaMock.$queryRaw.mockResolvedValue([{ '?column?': 1 }] as any)

      const res = await app.inject({ method: 'GET', url: '/api/health' })

      expect(res.statusCode).toBe(200)
      expect(res.json()).toEqual({ status: 'ok', db: 'up' })
    })

    it('returns 503 with db down when the database is unreachable', async () => {
      prismaMock.$queryRaw.mockRejectedValue(new Error('connection refused'))

      const res = await app.inject({ method: 'GET', url: '/api/health' })

      expect(res.statusCode).toBe(503)
      expect(res.json()).toEqual({ status: 'error', db: 'down' })
    })
  })
})
