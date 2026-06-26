/**
 * Job route definitions.
 * All routes here require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as jobController from '../controllers/job.controller.js'

export async function jobRoutes(app: FastifyInstance) {
  // Tighter rate limit on write routes (resource-mutating / auth-adjacent).
  const writeLimit = { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }
  app.post('/jobs', { preHandler: [authMiddleware], ...writeLimit }, jobController.create)
  app.get('/jobs', { preHandler: [authMiddleware] }, jobController.getAll)
  app.get('/jobs/:id', { preHandler: [authMiddleware] }, jobController.getById)
  app.put('/jobs/:id', { preHandler: [authMiddleware], ...writeLimit }, jobController.update)
  app.delete('/jobs/:id', { preHandler: [authMiddleware], ...writeLimit }, jobController.remove)
}
