import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import '../../mocks/clerk.js'
import '../../mocks/prisma.js'
import { mockGetAuth } from '../../mocks/clerk.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeJob, makeRate, makeRateInput } from '../../helpers/factories.js'
import { buildApp } from '../../helpers/app.js'
import type { FastifyInstance } from 'fastify'

let app: FastifyInstance
const url = '/api/jobs/job-1/rates'

beforeAll(async () => { app = await buildApp() })
afterAll(async () => { await app.close() })
beforeEach(() => { prismaMock.job.findFirst.mockResolvedValue(makeJob({ id: 'job-1', userId: 'test-user-id' }) as any) })

describe('job rate routes', () => {
  it('requires authentication', async () => {
    mockGetAuth.mockReturnValueOnce({ userId: null })
    expect((await app.inject({ method: 'GET', url })).statusCode).toBe(401)
  })

  it('creates and lists rates for a job', async () => {
    const rate = makeRate({ jobId: 'job-1' })
    prismaMock.rate.create.mockResolvedValue(rate as any)
    expect((await app.inject({ method: 'POST', url, payload: makeRateInput() })).statusCode).toBe(201)
    prismaMock.rate.findMany.mockResolvedValue([rate] as any)
    prismaMock.rate.count.mockResolvedValue(1)
    expect((await app.inject({ method: 'GET', url })).json().total).toBe(1)
  })

  it('returns 404 for an inaccessible job or cross-job rate ID', async () => {
    prismaMock.job.findFirst.mockResolvedValue(null)
    expect((await app.inject({ method: 'GET', url })).statusCode).toBe(404)
    prismaMock.job.findFirst.mockResolvedValue(makeJob({ id: 'job-1', userId: 'test-user-id' }) as any)
    prismaMock.rate.findFirst.mockResolvedValue(null)
    expect((await app.inject({ method: 'GET', url: url + '/rate-1' })).statusCode).toBe(404)
  })

  it('updates and deletes a job rate', async () => {
    const rate = makeRate({ jobId: 'job-1' })
    prismaMock.rate.findFirst.mockResolvedValue(rate as any)
    prismaMock.rate.update.mockResolvedValue(rate as any)
    prismaMock.rate.delete.mockResolvedValue(rate as any)
    expect((await app.inject({ method: 'PUT', url: url + '/' + rate.id, payload: { marginPercentage: 20 } })).statusCode).toBe(200)
    expect((await app.inject({ method: 'DELETE', url: url + '/' + rate.id })).statusCode).toBe(204)
  })
})
