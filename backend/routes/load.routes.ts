/**
 * Load route definitions.
 * Nested under /jobs/:jobId/load for single-job operations,
 * plus a flat /loads endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as loadController from '../controllers/load.controller.js'

export async function loadRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/load', owned, loadController.upsert)
  app.get('/jobs/:jobId/load', owned, loadController.getByJobId)
  app.put('/jobs/:jobId/load', owned, loadController.update)
  app.delete('/jobs/:jobId/load', owned, loadController.remove)
  app.get('/loads', { preHandler: [authMiddleware] }, loadController.getAll)
}
