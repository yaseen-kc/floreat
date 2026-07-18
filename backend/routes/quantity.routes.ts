/**
 * Quantity route definitions.
 * Nested under /jobs/:jobId/quantity for single-job operations,
 * plus a flat /quantities endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as quantityController from '../controllers/quantity.controller.js'

export async function quantityRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/quantity', owned, quantityController.upsert)
  app.get('/jobs/:jobId/quantity', owned, quantityController.getByJobId)
  app.put('/jobs/:jobId/quantity', owned, quantityController.update)
  app.delete('/jobs/:jobId/quantity', owned, quantityController.remove)
  app.get('/quantities', { preHandler: [authMiddleware] }, quantityController.getAll)
}
