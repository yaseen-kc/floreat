import { FastifyReply, FastifyRequest } from 'fastify'
import { createSpecSchema, paginationSchema, updateSpecSchema } from '../schemas/spec.schema.js'
import * as specService from '../services/spec.service.js'
import { sendError } from '../utils/response.js'

function isNotFoundError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025'
}

/** POST /api/specs — creates a global product specification. */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const result = createSpecSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const spec = await specService.createSpec(result.data)
  return reply.status(201).send(spec)
}

/** GET /api/specs — returns a paginated global product-specification list. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await specService.getSpecs(result.data.page, result.data.pageSize))
}

/** GET /api/specs/:id — returns one global product specification. */
export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const spec = await specService.getSpecById(id)
  if (!spec) return sendError(reply, 404, 'Spec not found')
  return reply.send(spec)
}

/** PUT /api/specs/:id — partially updates one global product specification. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const result = updateSpecSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const spec = await specService.updateSpec(id, result.data)
    return reply.send(spec)
  } catch (error: unknown) {
    if (isNotFoundError(error)) return sendError(reply, 404, 'Spec not found')
    throw error
  }
}

/** DELETE /api/specs/:id — deletes one global product specification. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  try {
    await specService.deleteSpec(id)
    return reply.status(204).send()
  } catch (error: unknown) {
    if (isNotFoundError(error)) return sendError(reply, 404, 'Spec not found')
    throw error
  }
}
