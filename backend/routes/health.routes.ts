/**
 * Health route definitions.
 * Public (no authentication) and exempt from the global rate limiter so
 * monitors/load balancers can poll freely.
 */
import { FastifyInstance } from 'fastify'
import { getHealth } from '../controllers/health.controller.js'

export async function healthRoutes(app: FastifyInstance) {
  // GET /api/health — public liveness + readiness probe.
  // No authMiddleware (intentionally public); rateLimit disabled for this route.
  app.get('/health', { config: { rateLimit: false } }, getHealth)
}
