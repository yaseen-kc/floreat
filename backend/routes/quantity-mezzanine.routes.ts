import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as ctrl from '../controllers/quantity-mezzanine.controller.js'

export async function quantityMezzanineRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/quantity/mezzanine', owned, ctrl.upsert)
  app.get('/jobs/:jobId/quantity/mezzanine', owned, ctrl.getByJobId)
  app.put('/jobs/:jobId/quantity/mezzanine', owned, ctrl.update)
  app.delete('/jobs/:jobId/quantity/mezzanine', owned, ctrl.remove)
  app.get('/quantity-mezzanines', { preHandler: [authMiddleware] }, ctrl.getAll)
}
