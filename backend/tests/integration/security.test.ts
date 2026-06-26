import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../mocks/clerk.js'
import '../mocks/prisma.js'
import { buildApp } from '../helpers/app.js'
import { FastifyInstance } from 'fastify'

describe('Security: headers + rate limiting (F-03)', () => {
  describe('helmet security headers', () => {
    let app: FastifyInstance
    beforeAll(async () => { app = await buildApp() })
    afterAll(async () => { await app.close() })

    it('sets helmet + rate-limit headers on responses', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/jobs' })
      expect(res.headers['x-content-type-options']).toBe('nosniff')
      expect(res.headers['x-frame-options']).toBeDefined()
      expect(res.headers['x-ratelimit-limit']).toBeDefined()
    })
  })

  describe('global rate limit', () => {
    let app: FastifyInstance
    beforeAll(async () => { app = await buildApp({ rateLimit: { max: 2, timeWindow: '1 minute' } }) })
    afterAll(async () => { await app.close() })

    it('returns 429 once the global limit is exceeded', async () => {
      const r1 = await app.inject({ method: 'GET', url: '/api/jobs' })
      const r2 = await app.inject({ method: 'GET', url: '/api/jobs' })
      const r3 = await app.inject({ method: 'GET', url: '/api/jobs' })
      expect(r1.statusCode).not.toBe(429)
      expect(r2.statusCode).not.toBe(429)
      expect(r3.statusCode).toBe(429)
    })
  })

  describe('per-route limit on auth-adjacent routes', () => {
    let app: FastifyInstance
    // High global limit so only the tighter per-route ceiling (20/min on /me) can trip.
    beforeAll(async () => { app = await buildApp({ rateLimit: { max: 100000, timeWindow: '1 minute' } }) })
    afterAll(async () => { await app.close() })

    it('trips the /me per-route limit (20/min) before the global limit', async () => {
      let last = 200
      for (let i = 0; i < 21; i++) {
        const res = await app.inject({ method: 'GET', url: '/api/me' })
        last = res.statusCode
      }
      expect(last).toBe(429)
    })
  })
})
