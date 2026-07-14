/**
 * Spec route definitions.
 * Nested under /jobs/:jobId/spec for single-job operations,
 * plus a flat /specs endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as specController from '../controllers/spec.controller.js'

export async function specRoutes(app: FastifyInstance) {
  const writeLimit = { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  const ownedWrite = { preHandler: [authMiddleware, jobOwnership], ...writeLimit }

  app.post('/jobs/:jobId/spec', ownedWrite, specController.upsert)
  app.get('/jobs/:jobId/spec', owned, specController.getByJobId)
  app.put('/jobs/:jobId/spec', ownedWrite, specController.update)
  app.delete('/jobs/:jobId/spec', ownedWrite, specController.remove)
  app.get('/specs', { preHandler: [authMiddleware] }, specController.getAll)
}
