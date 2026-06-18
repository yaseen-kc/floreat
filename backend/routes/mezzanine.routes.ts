/**
 * Mezzanine route definitions.
 * Nested under /jobs/:jobId/mezzanine for single-job operations,
 * plus a flat /mezzanines endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as mezzanineController from '../controllers/mezzanine.controller.js'

export async function mezzanineRoutes(app: FastifyInstance) {
  app.post('/jobs/:jobId/mezzanine', { preHandler: [authMiddleware] }, mezzanineController.upsert)
  app.get('/jobs/:jobId/mezzanine', { preHandler: [authMiddleware] }, mezzanineController.getByJobId)
  app.put('/jobs/:jobId/mezzanine', { preHandler: [authMiddleware] }, mezzanineController.update)
  app.delete('/jobs/:jobId/mezzanine', { preHandler: [authMiddleware] }, mezzanineController.remove)
  app.get('/mezzanines', { preHandler: [authMiddleware] }, mezzanineController.getAll)
}
