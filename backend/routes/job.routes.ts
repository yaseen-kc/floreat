/**
 * Job route definitions.
 * All routes here require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as jobController from '../controllers/job.controller.js'

export async function jobRoutes(app: FastifyInstance) {
  app.post('/jobs', { preHandler: [authMiddleware] }, jobController.create)
  app.get('/jobs', { preHandler: [authMiddleware] }, jobController.getAll)
  app.get('/jobs/:id', { preHandler: [authMiddleware] }, jobController.getById)
  app.put('/jobs/:id', { preHandler: [authMiddleware] }, jobController.update)
  app.delete('/jobs/:id', { preHandler: [authMiddleware] }, jobController.remove)
}
