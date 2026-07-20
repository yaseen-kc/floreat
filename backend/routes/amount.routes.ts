/**
 * Amount route definitions.
 * Nested under /jobs/:jobId/amount for single-job operations,
 * plus a flat /amounts endpoint for paginated listing.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as amountController from '../controllers/amount.controller.js'

export async function amountRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/amount', owned, amountController.upsert)
  app.get('/jobs/:jobId/amount', owned, amountController.getByJobId)
  app.put('/jobs/:jobId/amount', owned, amountController.update)
  app.delete('/jobs/:jobId/amount', owned, amountController.remove)
  app.get('/amounts', { preHandler: [authMiddleware] }, amountController.getAll)
}
