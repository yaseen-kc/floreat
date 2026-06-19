/**
 * Stair route definitions.
 * Nested under /jobs/:jobId/stair for single-job operations,
 * plus a flat /stairs endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as stairController from '../controllers/stair.controller.js'

export async function stairRoutes(app: FastifyInstance) {
  app.post('/jobs/:jobId/stair', { preHandler: [authMiddleware] }, stairController.upsert)
  app.get('/jobs/:jobId/stair', { preHandler: [authMiddleware] }, stairController.getByJobId)
  app.put('/jobs/:jobId/stair', { preHandler: [authMiddleware] }, stairController.update)
  app.delete('/jobs/:jobId/stair', { preHandler: [authMiddleware] }, stairController.remove)
  app.get('/stairs', { preHandler: [authMiddleware] }, stairController.getAll)
}
