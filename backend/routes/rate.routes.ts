/** Job-owned rate routes. */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as rateController from '../controllers/rate.controller.js'

export async function rateRoutes(app: FastifyInstance) {
  const writeLimit = { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }
  const read = { preHandler: [authMiddleware, jobOwnership] }
  const write = { preHandler: [authMiddleware, jobOwnership], ...writeLimit }
  app.post('/jobs/:jobId/rates', write, rateController.create)
  app.put('/jobs/:jobId/rates/bulk', write, rateController.replaceAll)
  app.get('/jobs/:jobId/rates', read, rateController.getAll)
  app.get('/jobs/:jobId/rates/:id', read, rateController.getById)
  app.put('/jobs/:jobId/rates/:id', write, rateController.update)
  app.delete('/jobs/:jobId/rates/:id', write, rateController.remove)
}
