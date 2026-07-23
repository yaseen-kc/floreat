import { FastifyRequest, FastifyReply } from 'fastify'
import { createQuantityAdditionalBoltsSchema, updateQuantityAdditionalBoltsSchema, paginationSchema } from '../schemas/quantity.schema.js'
import * as svc from '../services/quantity-additional-bolts.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/quantity/additional-bolts — upserts the additionalBolts section for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createQuantityAdditionalBoltsSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.status(200).send(await svc.upsertQuantityAdditionalBolts(jobId, result.data))
}

/** GET /api/jobs/:jobId/quantity/additional-bolts — returns the additionalBolts section for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const data = await svc.getQuantityAdditionalBoltsByJobId(jobId)
  if (!data) return sendError(reply, 404, 'Quantity additionalBolts not found')
  return reply.send(data)
}

/** PUT /api/jobs/:jobId/quantity/additional-bolts — partially updates the additionalBolts section. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateQuantityAdditionalBoltsSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    return reply.send(await svc.updateQuantityAdditionalBolts(jobId, result.data))
  } catch {
    return sendError(reply, 404, 'Quantity additionalBolts not found')
  }
}

/** DELETE /api/jobs/:jobId/quantity/additional-bolts — deletes the additionalBolts section. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await svc.deleteQuantityAdditionalBolts(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quantity additionalBolts not found')
    throw err
  }
}

/** GET /api/quantity-additional-bolts — paginated list of the user's additionalBolts sections. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await svc.getQuantityAdditionalBoltsList(request.userId, result.data.page, result.data.pageSize))
}
