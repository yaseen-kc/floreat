/**
 * Accessories route definitions.
 * Nested under /jobs/:jobId/accessories for single-job operations,
 * plus a flat /accessories endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as accessoriesController from '../controllers/accessories.controller.js'

export async function accessoriesRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/accessories', owned, accessoriesController.upsert)
  app.get('/jobs/:jobId/accessories', owned, accessoriesController.getByJobId)
  app.put('/jobs/:jobId/accessories', owned, accessoriesController.update)
  app.delete('/jobs/:jobId/accessories', owned, accessoriesController.remove)
  app.get('/accessories', { preHandler: [authMiddleware] }, accessoriesController.getAll)
}
