/**
 * Health controller — handles HTTP request/response for the public health endpoint.
 * Delegates the database readiness check to the health service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { isDatabaseReady } from '../services/health.service.js'

/**
 * GET /api/health — public liveness + readiness probe (no authentication).
 * Reaching this handler proves the process is live; it then pings the database
 * for readiness. Returns 200 `{ status: 'ok', db: 'up' }` when the DB is
 * reachable, or 503 `{ status: 'error', db: 'down' }` when it is not. No
 * internal error details are exposed.
 */
export async function getHealth(request: FastifyRequest, reply: FastifyReply) {
  const dbReady = await isDatabaseReady()
  if (dbReady) return reply.status(200).send({ status: 'ok', db: 'up' })
  return reply.status(503).send({ status: 'error', db: 'down' })
}
