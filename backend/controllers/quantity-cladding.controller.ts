import { FastifyRequest, FastifyReply } from 'fastify'
import { createQuantityCladdingSchema, updateQuantityCladdingSchema, paginationSchema } from '../schemas/quantity.schema.js'
import * as svc from '../services/quantity-cladding.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/quantity/cladding — upserts the cladding section for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createQuantityCladdingSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.status(200).send(await svc.upsertQuantityCladding(jobId, result.data))
}

/** GET /api/jobs/:jobId/quantity/cladding — returns the cladding section for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const data = await svc.getQuantityCladdingByJobId(jobId)
  if (!data) return sendError(reply, 404, 'Quantity cladding not found')
  return reply.send(data)
}

/** PUT /api/jobs/:jobId/quantity/cladding — partially updates the cladding section. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateQuantityCladdingSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    return reply.send(await svc.updateQuantityCladding(jobId, result.data))
  } catch {
    return sendError(reply, 404, 'Quantity cladding not found')
  }
}

/** DELETE /api/jobs/:jobId/quantity/cladding — deletes the cladding section. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await svc.deleteQuantityCladding(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quantity cladding not found')
    throw err
  }
}

/** GET /api/quantity-claddings — paginated list of the user's cladding sections. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await svc.getQuantityCladdings(request.userId, result.data.page, result.data.pageSize))
}
