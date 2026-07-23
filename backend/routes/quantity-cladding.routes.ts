import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as ctrl from '../controllers/quantity-cladding.controller.js'

export async function quantityCladdingRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/quantity/cladding', owned, ctrl.upsert)
  app.get('/jobs/:jobId/quantity/cladding', owned, ctrl.getByJobId)
  app.put('/jobs/:jobId/quantity/cladding', owned, ctrl.update)
  app.delete('/jobs/:jobId/quantity/cladding', owned, ctrl.remove)
  app.get('/quantity-claddings', { preHandler: [authMiddleware] }, ctrl.getAll)
}
