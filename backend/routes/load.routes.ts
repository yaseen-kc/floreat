/**
 * Load route definitions.
 * Nested under /jobs/:jobId/load for single-job operations,
 * plus a flat /loads endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as loadController from '../controllers/load.controller.js'

export async function loadRoutes(app: FastifyInstance) {
  app.post('/jobs/:jobId/load', { preHandler: [authMiddleware] }, loadController.upsert)
  app.get('/jobs/:jobId/load', { preHandler: [authMiddleware] }, loadController.getByJobId)
  app.put('/jobs/:jobId/load', { preHandler: [authMiddleware] }, loadController.update)
  app.delete('/jobs/:jobId/load', { preHandler: [authMiddleware] }, loadController.remove)
  app.get('/loads', { preHandler: [authMiddleware] }, loadController.getAll)
}
