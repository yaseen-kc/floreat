/**
 * Roof route definitions.
 * Nested under /jobs/:jobId/roof for single-job operations,
 * plus a flat /roofs endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as roofController from '../controllers/roof.controller.js'

export async function roofRoutes(app: FastifyInstance) {
  app.post('/jobs/:jobId/roof', { preHandler: [authMiddleware] }, roofController.upsert)
  app.get('/jobs/:jobId/roof', { preHandler: [authMiddleware] }, roofController.getByJobId)
  app.put('/jobs/:jobId/roof', { preHandler: [authMiddleware] }, roofController.update)
  app.delete('/jobs/:jobId/roof', { preHandler: [authMiddleware] }, roofController.remove)
  app.get('/roofs', { preHandler: [authMiddleware] }, roofController.getAll)
}
