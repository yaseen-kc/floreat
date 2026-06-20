/**
 * Canopy controller — handles HTTP request/response logic for canopy endpoints.
 * Delegates business logic to the canopy service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createCanopySchema, updateCanopySchema, paginationSchema } from '../schemas/canopy.schema.js'
import * as canopyService from '../services/canopy.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/canopy — upserts a canopy for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createCanopySchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const canopy = await canopyService.upsertCanopy(jobId, result.data)
  return reply.status(200).send(canopy)
}

/** GET /api/canopies — returns a paginated list of all canopies. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await canopyService.getCanopies(result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/canopy — returns the canopy for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const canopy = await canopyService.getCanopyByJobId(jobId)
  if (!canopy) return sendError(reply, 404, 'Canopy not found')
  return reply.send(canopy)
}

/** PUT /api/jobs/:jobId/canopy — partially updates the canopy for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateCanopySchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const canopy = await canopyService.updateCanopy(jobId, result.data)
    return reply.send(canopy)
  } catch {
    return sendError(reply, 404, 'Canopy not found')
  }
}

/** DELETE /api/jobs/:jobId/canopy — deletes the canopy for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await canopyService.deleteCanopy(jobId)
    return reply.status(200).send({ message: 'Canopy deleted successfully' })
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Canopy not found')
    throw err
  }
}
