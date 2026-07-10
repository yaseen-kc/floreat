/**
 * Canopy route definitions.
 * Nested under /jobs/:jobId/canopy for single-job operations,
 * plus a flat /canopies endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as canopyController from '../controllers/canopy.controller.js'

export async function canopyRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/canopy', owned, canopyController.upsert)
  app.get('/jobs/:jobId/canopy', owned, canopyController.getByJobId)
  app.put('/jobs/:jobId/canopy', owned, canopyController.update)
  app.delete('/jobs/:jobId/canopy', owned, canopyController.remove)
  app.get('/canopies', { preHandler: [authMiddleware] }, canopyController.getAll)
}
