/**
 * Stair route definitions.
 * Nested under /jobs/:jobId/stair for single-job operations,
 * plus a flat /stairs endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as stairController from '../controllers/stair.controller.js'

export async function stairRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/stair', owned, stairController.upsert)
  app.get('/jobs/:jobId/stair', owned, stairController.getByJobId)
  app.put('/jobs/:jobId/stair', owned, stairController.update)
  app.delete('/jobs/:jobId/stair', owned, stairController.remove)
  app.get('/stairs', { preHandler: [authMiddleware] }, stairController.getAll)
}
