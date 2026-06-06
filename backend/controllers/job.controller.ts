/**
 * Job controller — handles HTTP request/response logic for job endpoints.
 * Delegates business logic to the job service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { createJobSchema, updateJobSchema, paginationSchema } from '../schemas/job.schema.js'
import * as jobService from '../services/job.service.js'
import { sendError } from '../utils/response.js'

/** POST /api/jobs — creates a new job. */
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const result = createJobSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  const job = await jobService.createJob(result.data)
  return reply.status(201).send(job)
}

/** GET /api/jobs — returns a paginated list of jobs. */
export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const result = paginationSchema.safeParse(request.query)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  return reply.send(await jobService.getJobs(result.data.page, result.data.pageSize))
}

/** GET /api/jobs/:id — returns a single job by ID. */
export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const job = await jobService.getJobById(id)
  if (!job) return sendError(reply, 404, 'Job not found')
  return reply.send(job)
}

/** PUT /api/jobs/:id — partially updates a job. */
export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const result = updateJobSchema.safeParse(request.body)
  if (!result.success) return reply.status(400).send({ error: result.error.flatten() })
  try {
    const job = await jobService.updateJob(id, result.data)
    return reply.send(job)
  } catch {
    return sendError(reply, 404, 'Job not found')
  }
}

/** DELETE /api/jobs/:id — deletes a job. */
export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  try {
    await jobService.deleteJob(id)
    return reply.status(204).send()
  } catch {
    return sendError(reply, 404, 'Job not found')
  }
}
