/**
 * Job controller — handles HTTP request/response logic for job endpoints.
 * Delegates business logic to the job service layer. Every handler passes the
 * authenticated `request.userId` so jobs are scoped to their owner (C1).
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createJobSchema, updateJobSchema, paginationSchema } from '../schemas/job.schema.js'
import * as jobService from '../services/job.service.js'
import { sendError } from '../utils/response.js'
import { isGlobalRole } from '../auth/authorization.js'

/** POST /api/jobs — creates a new job owned by the authenticated user. */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const result = createJobSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const job = await jobService.createJob(request.userId, result.data)
  return reply.status(201).send(job)
}

/** GET /api/jobs — returns a paginated list of the user's jobs. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await jobService.getJobs(request.userId, result.data.page, result.data.pageSize, isGlobalRole(request.role)))
}

/** GET /api/jobs/:id — returns a single job owned by the user. */
export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const job = await jobService.getJobById(id, request.userId, isGlobalRole(request.role))
  if (!job) return sendError(reply, 404, 'Job not found')
  return reply.send(job)
}

/** GET /api/all/:jobId (or /api/jobs/:jobId/all) — returns all aggregated data for a specific job. */
export async function getAllDataByJobId(request: FastifyRequest, reply: FastifyReply) {
  const { jobId, id } = request.params as { jobId?: string; id?: string }
  const targetId = jobId || id
  if (!targetId) return sendError(reply, 400, 'Job ID is required')
  const job = await jobService.getJobWithAllData(targetId, request.userId, isGlobalRole(request.role))
  if (!job) return sendError(reply, 404, 'Job not found')
  return reply.send(job)
}

/** PUT /api/jobs/:id — partially updates a job owned by the user. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const result = updateJobSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const job = await jobService.updateJob(id, request.userId, result.data)
    return reply.send(job)
  } catch {
    return sendError(reply, 404, 'Job not found')
  }
}

/** DELETE /api/jobs/:id — deletes a job owned by the user. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  try {
    await jobService.deleteJob(id, request.userId)
    return reply.status(204).send()
  } catch (err: any) {
    if (err?.code === 'P2025') return sendError(reply, 404, 'Job not found')
    throw err
  }
}
