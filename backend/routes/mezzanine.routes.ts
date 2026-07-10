/**
 * Mezzanine route definitions.
 * Nested under /jobs/:jobId/mezzanine for single-job operations,
 * plus a flat /mezzanines endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as mezzanineController from '../controllers/mezzanine.controller.js'

export async function mezzanineRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/mezzanine', owned, mezzanineController.upsert)
  app.get('/jobs/:jobId/mezzanine', owned, mezzanineController.getByJobId)
  app.put('/jobs/:jobId/mezzanine', owned, mezzanineController.update)
  app.delete('/jobs/:jobId/mezzanine', owned, mezzanineController.remove)
  app.get('/mezzanines', { preHandler: [authMiddleware] }, mezzanineController.getAll)
}
