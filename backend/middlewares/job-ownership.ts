/**
 * Job-ownership middleware — enforces tenant isolation on nested resources.
 * For any route carrying a `:jobId` param, verifies the job exists AND belongs
 * to the authenticated user (request.userId === Job.userId). Returns 404 when
 * the job is missing or owned by someone else (404, not 403, to avoid leaking
 * the existence of other users' jobs).
 *
 * Chain it after `authMiddleware` on every `/jobs/:jobId/...` route.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { sendError } from '../utils/response.js'

export async function jobOwnership(request: FastifyRequest, reply: FastifyReply) {
  const { jobId } = request.params as { jobId?: string }
  if (!jobId) return

  const job = await prisma.job.findFirst({
    where: { id: jobId, userId: request.userId },
    select: { id: true },
  })
  if (!job) return sendError(reply, 404, 'Job not found')
}
