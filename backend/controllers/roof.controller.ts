/**
 * Roof controller — handles HTTP request/response logic for roof endpoints.
 * Delegates business logic to the roof service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createRoofSchema, updateRoofSchema, paginationSchema } from '../schemas/roof.schema.js'
import * as roofService from '../services/roof.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/roof — upserts a roof for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createRoofSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const roof = await roofService.upsertRoof(jobId, result.data)
  return reply.status(200).send(roof)
}

/** GET /api/roofs — returns a paginated list of all roofs. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await roofService.getRoofs(request.userId, result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/roof — returns the roof for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const roof = await roofService.getRoofByJobId(jobId)
  if (!roof) return sendError(reply, 404, 'Roof not found')
  return reply.send(roof)
}

/** PUT /api/jobs/:jobId/roof — partially updates the roof for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateRoofSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const roof = await roofService.updateRoof(jobId, result.data)
    return reply.send(roof)
  } catch {
    return sendError(reply, 404, 'Roof not found')
  }
}

/** DELETE /api/jobs/:jobId/roof — deletes the roof for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await roofService.deleteRoof(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Roof not found')
    throw err
  }
}
