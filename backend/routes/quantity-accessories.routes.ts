import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as ctrl from '../controllers/quantity-accessories.controller.js'

export async function quantityAccessoriesRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/quantity/accessories', owned, ctrl.upsert)
  app.get('/jobs/:jobId/quantity/accessories', owned, ctrl.getByJobId)
  app.put('/jobs/:jobId/quantity/accessories', owned, ctrl.update)
  app.delete('/jobs/:jobId/quantity/accessories', owned, ctrl.remove)
  app.get('/quantity-accessories', { preHandler: [authMiddleware] }, ctrl.getAll)
}
