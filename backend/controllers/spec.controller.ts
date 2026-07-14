/**
 * Spec controller — handles HTTP request/response logic for spec endpoints.
 * Delegates business logic to the spec service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createSpecSchema, updateSpecSchema, paginationSchema } from '../schemas/spec.schema.js'
import * as specService from '../services/spec.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/spec — upserts the spec for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createSpecSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const spec = await specService.upsertSpec(jobId, result.data)
  return reply.status(200).send(spec)
}

/** GET /api/specs — returns a paginated list of the user's specs. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await specService.getSpecs(request.userId, result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/spec — returns the spec for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const spec = await specService.getSpecByJobId(jobId)
  if (!spec) return sendError(reply, 404, 'Spec not found')
  return reply.send(spec)
}

/** PUT /api/jobs/:jobId/spec — partially updates the spec for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateSpecSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const spec = await specService.updateSpec(jobId, result.data)
    return reply.send(spec)
  } catch {
    return sendError(reply, 404, 'Spec not found')
  }
}

/** DELETE /api/jobs/:jobId/spec — deletes the spec for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await specService.deleteSpec(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Spec not found')
    throw err
  }
}
