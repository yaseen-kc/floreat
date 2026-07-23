import { FastifyRequest, FastifyReply } from 'fastify'
import { createQuantityMezzanineSchema, updateQuantityMezzanineSchema, paginationSchema } from '../schemas/quantity.schema.js'
import * as svc from '../services/quantity-mezzanine.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/quantity/mezzanine — upserts the mezzanine section for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createQuantityMezzanineSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.status(200).send(await svc.upsertQuantityMezzanine(jobId, result.data))
}

/** GET /api/jobs/:jobId/quantity/mezzanine — returns the mezzanine section for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const data = await svc.getQuantityMezzanineByJobId(jobId)
  if (!data) return sendError(reply, 404, 'Quantity mezzanine not found')
  return reply.send(data)
}

/** PUT /api/jobs/:jobId/quantity/mezzanine — partially updates the mezzanine section. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateQuantityMezzanineSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    return reply.send(await svc.updateQuantityMezzanine(jobId, result.data))
  } catch {
    return sendError(reply, 404, 'Quantity mezzanine not found')
  }
}

/** DELETE /api/jobs/:jobId/quantity/mezzanine — deletes the mezzanine section. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await svc.deleteQuantityMezzanine(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Quantity mezzanine not found')
    throw err
  }
}

/** GET /api/quantity-mezzanines — paginated list of the user's mezzanine sections. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await svc.getQuantityMezzanines(request.userId, result.data.page, result.data.pageSize))
}
