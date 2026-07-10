/**
 * Mezzanine controller — handles HTTP request/response logic for mezzanine endpoints.
 * Delegates business logic to the mezzanine service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createMezzanineSchema, updateMezzanineSchema, paginationSchema } from '../schemas/mezzanine.schema.js'
import * as mezzanineService from '../services/mezzanine.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/mezzanine — upserts a mezzanine for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createMezzanineSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const mezzanine = await mezzanineService.upsertMezzanine(jobId, result.data)
  return reply.status(200).send(mezzanine)
}

/** GET /api/mezzanines — returns a paginated list of all mezzanines. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await mezzanineService.getMezzanines(request.userId, result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/mezzanine — returns the mezzanine for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const mezzanine = await mezzanineService.getMezzanineByJobId(jobId)
  if (!mezzanine) return sendError(reply, 404, 'Mezzanine not found')
  return reply.send(mezzanine)
}

/** PUT /api/jobs/:jobId/mezzanine — partially updates the mezzanine for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateMezzanineSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const mezzanine = await mezzanineService.updateMezzanine(jobId, result.data)
    return reply.send(mezzanine)
  } catch {
    return sendError(reply, 404, 'Mezzanine not found')
  }
}

/** DELETE /api/jobs/:jobId/mezzanine — deletes the mezzanine for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await mezzanineService.deleteMezzanine(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Mezzanine not found')
    throw err
  }
}
