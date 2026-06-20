/**
 * Canopy route definitions.
 * Nested under /jobs/:jobId/canopy for single-job operations,
 * plus a flat /canopies endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as canopyController from '../controllers/canopy.controller.js'

export async function canopyRoutes(app: FastifyInstance) {
  app.post('/jobs/:jobId/canopy', { preHandler: [authMiddleware] }, canopyController.upsert)
  app.get('/jobs/:jobId/canopy', { preHandler: [authMiddleware] }, canopyController.getByJobId)
  app.put('/jobs/:jobId/canopy', { preHandler: [authMiddleware] }, canopyController.update)
  app.delete('/jobs/:jobId/canopy', { preHandler: [authMiddleware] }, canopyController.remove)
  app.get('/canopies', { preHandler: [authMiddleware] }, canopyController.getAll)
}
