/**
 * Roof route definitions.
 * Nested under /jobs/:jobId/roof for single-job operations,
 * plus a flat /roofs endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as roofController from '../controllers/roof.controller.js'

export async function roofRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/roof', owned, roofController.upsert)
  app.get('/jobs/:jobId/roof', owned, roofController.getByJobId)
  app.put('/jobs/:jobId/roof', owned, roofController.update)
  app.delete('/jobs/:jobId/roof', owned, roofController.remove)
  app.get('/roofs', { preHandler: [authMiddleware] }, roofController.getAll)
}
