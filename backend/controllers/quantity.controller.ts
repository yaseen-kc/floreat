/**
 * Quantity controller — handles HTTP request/response logic for quantity
 * endpoints. Delegates all business logic to the quantity service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createQuantitySchema, updateQuantitySchema, paginationSchema } from '../schemas/quantity.schema.js'
import * as quantityService from '../services/quantity.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/quantity — upserts the quantity for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createQuantitySchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const quantity = await quantityService.upsertQuantity(jobId, result.data)
  return reply.status(200).send(quantity)
}

/** GET /api/quantities — returns a paginated list of the user's quantities. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await quantityService.getQuantities(request.userId, result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/quantity — returns the quantity for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const quantity = await quantityService.getQuantityByJobId(jobId)
  if (!quantity) return sendError(reply, 404, 'Quantity not found')
  return reply.send(quantity)
}

/** PUT /api/jobs/:jobId/quantity — partially updates the quantity for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateQuantitySchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const quantity = await quantityService.updateQuantity(jobId, result.data)
    return reply.send(quantity)
  } catch {
    return sendError(reply, 404, 'Quantity not found')
  }
}

/** DELETE /api/jobs/:jobId/quantity — deletes the quantity for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await quantityService.deleteQuantity(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quantity not found')
    throw err
  }
}
