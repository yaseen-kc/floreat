import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeSpec, makeSpecInput } from '../../helpers/factories.js'
import * as specService from '../../../services/spec.service.js'
import { upsert, getAll, getByJobId, remove, update } from '../../../controllers/spec.controller.js'

vi.mock('../../../services/spec.service.js', () => ({
  upsertSpec: vi.fn(),
  getSpecs: vi.fn(),
  getSpecByJobId: vi.fn(),
  updateSpec: vi.fn(),
  deleteSpec: vi.fn(),
}))

const serviceMock = vi.mocked(specService)

function makeReply() {
  return {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply
}

describe('spec.controller', () => {
  beforeEach(() => vi.clearAllMocks())

  it('upserts a spec and returns 200', async () => {
    const input = makeSpecInput()
    const spec = makeSpec({ jobId: 'job-1', ...input })
    serviceMock.upsertSpec.mockResolvedValue(spec as never)
    const reply = makeReply()

    await upsert({ params: { jobId: 'job-1' }, body: input } as unknown as FastifyRequest, reply)

    expect(serviceMock.upsertSpec).toHaveBeenCalledWith('job-1', input)
    expect(reply.status).toHaveBeenCalledWith(200)
    expect(reply.send).toHaveBeenCalledWith(spec)
  })

  it('returns 400 for an invalid upsert body', async () => {
    const reply = makeReply()

    await upsert({ params: { jobId: 'job-1' }, body: { yieldStrengthMpa: -1 } } as unknown as FastifyRequest, reply)

    expect(reply.status).toHaveBeenCalledWith(400)
    expect(serviceMock.upsertSpec).not.toHaveBeenCalled()
  })

  it('returns a paginated list scoped to the user', async () => {
    const result = { data: [makeSpec()], total: 1, page: 1, pageSize: 10 }
    serviceMock.getSpecs.mockResolvedValue(result as never)
    const reply = makeReply()

    await getAll({ query: {}, userId: 'user_1' } as unknown as FastifyRequest, reply)

    expect(serviceMock.getSpecs).toHaveBeenCalledWith('user_1', 1, 10)
    expect(reply.send).toHaveBeenCalledWith(result)
  })

  it('returns 404 when the job has no spec', async () => {
    serviceMock.getSpecByJobId.mockResolvedValue(null)
    const reply = makeReply()

    await getByJobId({ params: { jobId: 'missing' } } as unknown as FastifyRequest, reply)

    expect(reply.status).toHaveBeenCalledWith(404)
    expect(reply.send).toHaveBeenCalledWith({ error: 'Spec not found' })
  })

  it('returns 404 when update encounters an error', async () => {
    serviceMock.updateSpec.mockRejectedValue(Object.assign(new Error('missing'), { code: 'P2025' }))
    const reply = makeReply()

    await update({ params: { jobId: 'missing' }, body: { description: 'Updated' } } as unknown as FastifyRequest, reply)

    expect(reply.status).toHaveBeenCalledWith(404)
    expect(reply.send).toHaveBeenCalledWith({ error: 'Spec not found' })
  })

  it('returns 204 after deleting a spec', async () => {
    serviceMock.deleteSpec.mockResolvedValue(makeSpec() as never)
    const reply = makeReply()

    await remove({ params: { jobId: 'job-1' } } as unknown as FastifyRequest, reply)

    expect(reply.status).toHaveBeenCalledWith(204)
    expect(reply.send).toHaveBeenCalledWith()
  })

  it('maps a P2025 delete error to 404', async () => {
    serviceMock.deleteSpec.mockRejectedValue(Object.assign(new Error('missing'), { code: 'P2025' }))
    const reply = makeReply()

    await remove({ params: { jobId: 'missing' } } as unknown as FastifyRequest, reply)

    expect(reply.status).toHaveBeenCalledWith(404)
    expect(reply.send).toHaveBeenCalledWith({ error: 'Spec not found' })
  })
})
