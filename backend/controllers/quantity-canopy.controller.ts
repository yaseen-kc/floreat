import { FastifyRequest, FastifyReply } from 'fastify'
import { createQuantityCanopySchema, updateQuantityCanopySchema, paginationSchema } from '../schemas/quantity.schema.js'
import * as svc from '../services/quantity-canopy.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/quantity/canopy — upserts the canopy section for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createQuantityCanopySchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.status(200).send(await svc.upsertQuantityCanopy(jobId, result.data))
}

/** GET /api/jobs/:jobId/quantity/canopy — returns the canopy section for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const data = await svc.getQuantityCanopyByJobId(jobId)
  if (!data) return sendError(reply, 404, 'Quantity canopy not found')
  return reply.send(data)
}

/** PUT /api/jobs/:jobId/quantity/canopy — partially updates the canopy section. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateQuantityCanopySchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    return reply.send(await svc.updateQuantityCanopy(jobId, result.data))
  } catch {
    return sendError(reply, 404, 'Quantity canopy not found')
  }
}

/** DELETE /api/jobs/:jobId/quantity/canopy — deletes the canopy section. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await svc.deleteQuantityCanopy(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quantity canopy not found')
    throw err
  }
}

/** GET /api/quantity-canopies — paginated list of the user's canopy sections. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await svc.getQuantityCanopies(request.userId, result.data.page, result.data.pageSize))
}
