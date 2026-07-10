/**
 * Accessories controller — handles HTTP request/response logic for accessories endpoints.
 * Delegates business logic to the accessories service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createAccessoriesSchema, updateAccessoriesSchema, paginationSchema } from '../schemas/accessories.schema.js'
import * as accessoriesService from '../services/accessories.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/accessories — upserts accessories for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createAccessoriesSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const accessories = await accessoriesService.upsertAccessories(jobId, result.data)
  return reply.status(200).send(accessories)
}

/** GET /api/accessories — returns a paginated list of the user's accessories. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await accessoriesService.getAccessories(request.userId, result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/accessories — returns the accessories for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const accessories = await accessoriesService.getAccessoriesByJobId(jobId)
  if (!accessories) return sendError(reply, 404, 'Accessories not found')
  return reply.send(accessories)
}

/** PUT /api/jobs/:jobId/accessories — partially updates the accessories for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateAccessoriesSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const accessories = await accessoriesService.updateAccessories(jobId, result.data)
    return reply.send(accessories)
  } catch {
    return sendError(reply, 404, 'Accessories not found')
  }
}

/** DELETE /api/jobs/:jobId/accessories — deletes the accessories for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await accessoriesService.deleteAccessories(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Accessories not found')
    throw err
  }
}
