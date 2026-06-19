/**
 * Stair controller — handles HTTP request/response logic for stair endpoints.
 * Delegates business logic to the stair service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createStairSchema, updateStairSchema, paginationSchema } from '../schemas/stair.schema.js'
import * as stairService from '../services/stair.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/stair — upserts a stair for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createStairSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const stair = await stairService.upsertStair(jobId, result.data)
  return reply.status(200).send(stair)
}

/** GET /api/stairs — returns a paginated list of all stairs. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await stairService.getStairs(result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/stair — returns the stair for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const stair = await stairService.getStairByJobId(jobId)
  if (!stair) return sendError(reply, 404, 'Stair not found')
  return reply.send(stair)
}

/** PUT /api/jobs/:jobId/stair — partially updates the stair for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateStairSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const stair = await stairService.updateStair(jobId, result.data)
    return reply.send(stair)
  } catch {
    return sendError(reply, 404, 'Stair not found')
  }
}

/** DELETE /api/jobs/:jobId/stair — deletes the stair for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await stairService.deleteStair(jobId)
    return reply.status(200).send({ message: 'Stair deleted successfully' })
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Stair not found')
    throw err
  }
}
