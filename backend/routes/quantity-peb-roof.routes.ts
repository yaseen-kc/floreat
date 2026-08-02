import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as ctrl from '../controllers/quantity-peb-roof.controller.js'

export async function quantityPebRoofRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/quantity/peb-roof', owned, ctrl.upsert)
  app.get('/jobs/:jobId/quantity/peb-roof', owned, ctrl.getByJobId)
  app.put('/jobs/:jobId/quantity/peb-roof', owned, ctrl.update)
  app.delete('/jobs/:jobId/quantity/peb-roof', owned, ctrl.remove)
  app.get('/quantity-peb-roofs', { preHandler: [authMiddleware] }, ctrl.getAll)
}
