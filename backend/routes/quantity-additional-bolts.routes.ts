import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as ctrl from '../controllers/quantity-additional-bolts.controller.js'

export async function quantityAdditionalBoltsRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/quantity/additional-bolts', owned, ctrl.upsert)
  app.get('/jobs/:jobId/quantity/additional-bolts', owned, ctrl.getByJobId)
  app.put('/jobs/:jobId/quantity/additional-bolts', owned, ctrl.update)
  app.delete('/jobs/:jobId/quantity/additional-bolts', owned, ctrl.remove)
  app.get('/quantity-additional-bolts', { preHandler: [authMiddleware] }, ctrl.getAll)
}
