/**
 * Roof route definitions.
 * All routes here require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as roofController from '../controllers/roof.controller.js'

export async function roofRoutes(app: FastifyInstance) {
  app.post('/roofs', { preHandler: [authMiddleware] }, roofController.create)
  app.get('/roofs/by-job/:jobId', { preHandler: [authMiddleware] }, roofController.getByJobId)
  app.get('/roofs/:id', { preHandler: [authMiddleware] }, roofController.getById)
  app.put('/roofs/:id', { preHandler: [authMiddleware] }, roofController.update)
  app.delete('/roofs/:id', { preHandler: [authMiddleware] }, roofController.remove)
}
