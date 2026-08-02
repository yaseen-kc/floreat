import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as ctrl from '../controllers/quantity-stair.controller.js'

export async function quantityStairRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/quantity/stair', owned, ctrl.upsert)
  app.get('/jobs/:jobId/quantity/stair', owned, ctrl.getByJobId)
  app.put('/jobs/:jobId/quantity/stair', owned, ctrl.update)
  app.delete('/jobs/:jobId/quantity/stair', owned, ctrl.remove)
  app.get('/quantity-stairs', { preHandler: [authMiddleware] }, ctrl.getAll)
}
