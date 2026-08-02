import { FastifyRequest, FastifyReply } from 'fastify'
import { createQuantityPebRoofSchema, updateQuantityPebRoofSchema, paginationSchema } from '../schemas/quantity.schema.js'
import * as svc from '../services/quantity-peb-roof.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/quantity/peb-roof — upserts the pebRoof section for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createQuantityPebRoofSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.status(200).send(await svc.upsertQuantityPebRoof(jobId, result.data))
}

/** GET /api/jobs/:jobId/quantity/peb-roof — returns the pebRoof section for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const data = await svc.getQuantityPebRoofByJobId(jobId)
  if (!data) return sendError(reply, 404, 'Quantity pebRoof not found')
  return reply.send(data)
}

/** PUT /api/jobs/:jobId/quantity/peb-roof — partially updates the pebRoof section. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateQuantityPebRoofSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    return reply.send(await svc.updateQuantityPebRoof(jobId, result.data))
  } catch {
    return sendError(reply, 404, 'Quantity pebRoof not found')
  }
}

/** DELETE /api/jobs/:jobId/quantity/peb-roof — deletes the pebRoof section. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await svc.deleteQuantityPebRoof(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quantity pebRoof not found')
    throw err
  }
}

/** GET /api/quantity-peb-roofs — paginated list of the user's pebRoof sections. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await svc.getQuantityPebRoofs(request.userId, result.data.page, result.data.pageSize))
}
