import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as ctrl from '../controllers/quantity-canopy.controller.js'

export async function quantityCanopyRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/quantity/canopy', owned, ctrl.upsert)
  app.get('/jobs/:jobId/quantity/canopy', owned, ctrl.getByJobId)
  app.put('/jobs/:jobId/quantity/canopy', owned, ctrl.update)
  app.delete('/jobs/:jobId/quantity/canopy', owned, ctrl.remove)
  app.get('/quantity-canopies', { preHandler: [authMiddleware] }, ctrl.getAll)
}
