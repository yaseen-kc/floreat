/**
 * Load controller — handles HTTP request/response logic for load endpoints.
 * Delegates business logic to the load service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createLoadSchema, updateLoadSchema, paginationSchema } from '../schemas/load.schema.js'
import * as loadService from '../services/load.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/load — upserts a load for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createLoadSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const load = await loadService.upsertLoad(jobId, result.data)
  return reply.status(200).send(load)
}

/** GET /api/loads — returns a paginated list of all loads. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await loadService.getLoads(request.userId, result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/load — returns the load for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const load = await loadService.getLoadByJobId(jobId)
  if (!load) return sendError(reply, 404, 'Load not found')
  return reply.send(load)
}

/** PUT /api/jobs/:jobId/load — partially updates the load for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateLoadSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const load = await loadService.updateLoad(jobId, result.data)
    return reply.send(load)
  } catch {
    return sendError(reply, 404, 'Load not found')
  }
}

/** DELETE /api/jobs/:jobId/load — deletes the load for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await loadService.deleteLoad(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Load not found')
    throw err
  }
}
