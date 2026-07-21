import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeRate, makeRateInput } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import type { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('Rate routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/rates' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/rates', () => {
    it('creates a rate', async () => {
      const input = makeRateInput({ item: 'STEEL STRUCTURE', unit: 'KG' })
      const rate = makeRate({ item: 'STEEL STRUCTURE', unit: 'KG' })
      prismaMock.rate.create.mockResolvedValue(rate as any)

      const res = await app.inject({ method: 'POST', url: '/api/rates', payload: input })

      expect(res.statusCode).toBe(201)
      expect(res.json().id).toBe(rate.id)
      expect(res.json()).toHaveProperty('totalRate')
    })

    it('rejects an invalid payload', async () => {
      const res = await app.inject({ method: 'POST', url: '/api/rates', payload: { unit: 'KG' } })
      expect(res.statusCode).toBe(400)
    })

    it('returns 409 on a duplicate item', async () => {
      prismaMock.rate.create.mockRejectedValue(Object.assign(new Error('dup'), { code: 'P2002' }))
      const res = await app.inject({ method: 'POST', url: '/api/rates', payload: { item: 'DUP', unit: 'KG' } })
      expect(res.statusCode).toBe(409)
    })
  })

  describe('GET /api/rates', () => {
    it('returns a paginated list', async () => {
      const rates = [makeRate(), makeRate()]
      prismaMock.rate.findMany.mockResolvedValue(rates as any)
      prismaMock.rate.count.mockResolvedValue(2)

      const res = await app.inject({ method: 'GET', url: '/api/rates?page=1&pageSize=10' })

      expect(res.statusCode).toBe(200)
      expect(res.json().data).toHaveLength(2)
      expect(res.json().total).toBe(2)
    })

    it('rejects invalid pagination', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/rates?page=0' })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/rates/:id', () => {
    it('returns the rate when found', async () => {
      const rate = makeRate()
      prismaMock.rate.findUnique.mockResolvedValue(rate as any)

      const res = await app.inject({ method: 'GET', url: `/api/rates/${rate.id}` })

      expect(res.statusCode).toBe(200)
      expect(res.json().id).toBe(rate.id)
    })

    it('returns 404 when not found', async () => {
      prismaMock.rate.findUnique.mockResolvedValue(null)
      const res = await app.inject({ method: 'GET', url: '/api/rates/nope' })
      expect(res.statusCode).toBe(404)
    })
  })

  describe('PUT /api/rates/:id', () => {
    it('updates a rate', async () => {
      const rate = makeRate()
      prismaMock.rate.findUnique.mockResolvedValueOnce(rate as any)
      prismaMock.rate.update.mockResolvedValue(rate as any)

      const res = await app.inject({ method: 'PUT', url: `/api/rates/${rate.id}`, payload: { marginPercentage: 20 } })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.rate.findUnique.mockResolvedValueOnce(null)
      const res = await app.inject({ method: 'PUT', url: '/api/rates/nope', payload: { marginPercentage: 20 } })
      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/rates/:id', () => {
    it('returns 204 with no body', async () => {
      prismaMock.rate.delete.mockResolvedValue(makeRate() as any)
      const res = await app.inject({ method: 'DELETE', url: '/api/rates/rate-1' })
      expect(res.statusCode).toBe(204)
      expect(res.body).toBe('')
    })

    it('returns 404 when not found', async () => {
      prismaMock.rate.delete.mockRejectedValue(Object.assign(new Error('missing'), { code: 'P2025' }))
      const res = await app.inject({ method: 'DELETE', url: '/api/rates/nope' })
      expect(res.statusCode).toBe(404)
    })
  })
})
