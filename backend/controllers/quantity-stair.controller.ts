import { FastifyRequest, FastifyReply } from 'fastify'
import { createQuantityStairSchema, updateQuantityStairSchema, paginationSchema } from '../schemas/quantity.schema.js'
import * as svc from '../services/quantity-stair.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/quantity/stair — upserts the stair section for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createQuantityStairSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.status(200).send(await svc.upsertQuantityStair(jobId, result.data))
}

/** GET /api/jobs/:jobId/quantity/stair — returns the stair section for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const data = await svc.getQuantityStairByJobId(jobId)
  if (!data) return sendError(reply, 404, 'Quantity stair not found')
  return reply.send(data)
}

/** PUT /api/jobs/:jobId/quantity/stair — partially updates the stair section. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateQuantityStairSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    return reply.send(await svc.updateQuantityStair(jobId, result.data))
  } catch {
    return sendError(reply, 404, 'Quantity stair not found')
  }
}

/** DELETE /api/jobs/:jobId/quantity/stair — deletes the stair section. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await svc.deleteQuantityStair(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quantity stair not found')
    throw err
  }
}

/** GET /api/quantity-stairs — paginated list of the user's stair sections. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await svc.getQuantityStairs(request.userId, result.data.page, result.data.pageSize))
}
