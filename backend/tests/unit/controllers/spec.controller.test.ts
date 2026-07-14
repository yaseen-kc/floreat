import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeSpec, makeSpecInput } from '../../helpers/factories.js'
import * as specService from '../../../services/spec.service.js'
import { create, getAll, getById, remove, update } from '../../../controllers/spec.controller.js'

vi.mock('../../../services/spec.service.js', () => ({
  createSpec: vi.fn(),
  getSpecs: vi.fn(),
  getSpecById: vi.fn(),
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

  it('creates a specification and returns 201', async () => {
    const input = makeSpecInput()
    const spec = makeSpec(input)
    serviceMock.createSpec.mockResolvedValue(spec as never)
    const reply = makeReply()

    await create({ body: input } as unknown as FastifyRequest, reply)

    expect(serviceMock.createSpec).toHaveBeenCalledWith(input)
    expect(reply.status).toHaveBeenCalledWith(201)
    expect(reply.send).toHaveBeenCalledWith(spec)
  })

  it('returns 400 for an invalid create body', async () => {
    const reply = makeReply()

    await create({ body: {} } as unknown as FastifyRequest, reply)

    expect(reply.status).toHaveBeenCalledWith(400)
    expect(serviceMock.createSpec).not.toHaveBeenCalled()
  })

  it('returns a paginated list', async () => {
    const result = { data: [makeSpec()], total: 1, page: 1, pageSize: 10 }
    serviceMock.getSpecs.mockResolvedValue(result as never)
    const reply = makeReply()

    await getAll({ query: {} } as unknown as FastifyRequest, reply)

    expect(serviceMock.getSpecs).toHaveBeenCalledWith(1, 10)
    expect(reply.send).toHaveBeenCalledWith(result)
  })

  it('returns 404 when a specification is not found', async () => {
    serviceMock.getSpecById.mockResolvedValue(null)
    const reply = makeReply()

    await getById({ params: { id: 'missing' } } as unknown as FastifyRequest, reply)

    expect(reply.status).toHaveBeenCalledWith(404)
    expect(reply.send).toHaveBeenCalledWith({ error: 'Spec not found' })
  })

  it('returns 404 when update encounters P2025', async () => {
    serviceMock.updateSpec.mockRejectedValue(Object.assign(new Error('missing'), { code: 'P2025' }))
    const reply = makeReply()

    await update({ params: { id: 'missing' }, body: { description: 'Updated' } } as unknown as FastifyRequest, reply)

    expect(reply.status).toHaveBeenCalledWith(404)
    expect(reply.send).toHaveBeenCalledWith({ error: 'Spec not found' })
  })

  it('returns 204 after deleting a specification', async () => {
    serviceMock.deleteSpec.mockResolvedValue(makeSpec() as never)
    const reply = makeReply()

    await remove({ params: { id: 'spec-1' } } as unknown as FastifyRequest, reply)

    expect(reply.status).toHaveBeenCalledWith(204)
    expect(reply.send).toHaveBeenCalledWith()
  })
})
