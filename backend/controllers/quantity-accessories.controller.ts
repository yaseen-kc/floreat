import { FastifyRequest, FastifyReply } from 'fastify'
import { createQuantityAccessoriesSchema, updateQuantityAccessoriesSchema, paginationSchema } from '../schemas/quantity.schema.js'
import * as svc from '../services/quantity-accessories.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/quantity/accessories — upserts the accessories section for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createQuantityAccessoriesSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.status(200).send(await svc.upsertQuantityAccessories(jobId, result.data))
}

/** GET /api/jobs/:jobId/quantity/accessories — returns the accessories section for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const data = await svc.getQuantityAccessoriesByJobId(jobId)
  if (!data) return sendError(reply, 404, 'Quantity accessories not found')
  return reply.send(data)
}

/** PUT /api/jobs/:jobId/quantity/accessories — partially updates the accessories section. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateQuantityAccessoriesSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    return reply.send(await svc.updateQuantityAccessories(jobId, result.data))
  } catch {
    return sendError(reply, 404, 'Quantity accessories not found')
  }
}

/** DELETE /api/jobs/:jobId/quantity/accessories — deletes the accessories section. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await svc.deleteQuantityAccessories(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quantity accessories not found')
    throw err
  }
}

/** GET /api/quantity-accessories — paginated list of the user's accessories sections. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await svc.getQuantityAccessoriesList(request.userId, result.data.page, result.data.pageSize))
}
