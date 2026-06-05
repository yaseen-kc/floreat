import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeRoof, makeRoofInput } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })

describe('Roof routes integration', () => {
  describe('authentication', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetAuth.mockReturnValueOnce({ userId: null })
      const res = await app.inject({ method: 'GET', url: '/api/roofs/some-id' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/roofs', () => {
    it('creates a roof successfully', async () => {
      const input = makeRoofInput()
      const roof = makeRoof(input)
      prismaMock.roof.create.mockResolvedValue(roof as any)

      const res = await app.inject({ method: 'POST', url: '/api/roofs', payload: input })

      expect(res.statusCode).toBe(201)
      expect(res.json().jobId).toBe(input.jobId)
    })

    it('rejects invalid payload', async () => {
      const res = await app.inject({ method: 'POST', url: '/api/roofs', payload: { jobId: '' } })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/roofs/:id', () => {
    it('returns a roof', async () => {
      const roof = makeRoof()
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)

      const res = await app.inject({ method: 'GET', url: `/api/roofs/${roof.id}` })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 for nonexistent roof', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/roofs/nope' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /api/roofs/by-job/:jobId', () => {
    it('returns a roof by job id', async () => {
      const roof = makeRoof()
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)

      const res = await app.inject({ method: 'GET', url: `/api/roofs/by-job/${roof.jobId}` })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when no roof for job', async () => {
      prismaMock.roof.findUnique.mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/api/roofs/by-job/nope' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('PUT /api/roofs/:id', () => {
    it('updates a roof', async () => {
      const roof = makeRoof()
      prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock))
      prismaMock.roof.update.mockResolvedValue(roof as any)
      prismaMock.roof.findUnique.mockResolvedValue(roof as any)

      const res = await app.inject({
        method: 'PUT', url: `/api/roofs/${roof.id}`,
        payload: { eaveHeight: 6 },
      })

      expect(res.statusCode).toBe(200)
    })

    it('returns 404 when not found', async () => {
      prismaMock.$transaction.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({
        method: 'PUT', url: '/api/roofs/nope',
        payload: { eaveHeight: 6 },
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/roofs/:id', () => {
    it('deletes a roof', async () => {
      prismaMock.roof.delete.mockResolvedValue({} as any)

      const res = await app.inject({ method: 'DELETE', url: '/api/roofs/roof-123' })

      expect(res.statusCode).toBe(204)
    })

    it('returns 404 when not found', async () => {
      prismaMock.roof.delete.mockRejectedValue(new Error('Not found'))

      const res = await app.inject({ method: 'DELETE', url: '/api/roofs/nope' })

      expect(res.statusCode).toBe(404)
    })
  })
})
