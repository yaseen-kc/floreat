/**
 * Joint controller — handles HTTP request/response logic for joint endpoints.
 * Delegates business logic to the joint service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createJointSchema, updateJointSchema, paginationSchema } from '../schemas/joint.schema.js'
import * as jointService from '../services/joint.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs/:jobId/joint — upserts a joint for the given job. */
export async function upsert(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = createJointSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const joint = await jointService.upsertJoint(jobId, result.data)
  return reply.status(200).send(joint)
}

/** GET /api/joints — returns a paginated list of all joints. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await jointService.getJoints(request.userId, result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:jobId/joint — returns the joint for a specific job. */
export async function getByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const joint = await jointService.getJointByJobId(jobId)
  if (!joint) return sendError(reply, 404, 'Joint not found')
  return reply.send(joint)
}

/** PUT /api/jobs/:jobId/joint — partially updates the joint for a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  const result = updateJointSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const joint = await jointService.updateJoint(jobId, result.data)
    return reply.send(joint)
  } catch {
    return sendError(reply, 404, 'Joint not found')
  }
}

/** DELETE /api/jobs/:jobId/joint — deletes the joint for a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId: string }
  try {
    await jointService.deleteJoint(jobId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Joint not found')
    throw err
  }
}
