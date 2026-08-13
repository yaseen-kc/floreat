/**
 * Quotation route definitions.
 * Nested under /jobs/:jobId/quotation for single-job operations,
 * plus a flat /quotations endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as quotationController from '../controllers/quotation.controller.js'
import { requirePermission } from '../middlewares/authorization.js'
import { PERMISSIONS } from '../auth/authorization.js'
import { loadAuthorization } from '../middlewares/authorization.js'

export async function quotationRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/quotation', owned, quotationController.upsert)
  app.get('/jobs/:jobId/quotation', owned, quotationController.getByJobId)
  app.put('/jobs/:jobId/quotation', owned, quotationController.update)
  app.delete('/jobs/:jobId/quotation', owned, quotationController.remove)
  app.get('/quotations', { preHandler: [authMiddleware, loadAuthorization] }, quotationController.getAll)
  app.post('/jobs/:jobId/quotation/transition', { preHandler: [authMiddleware, loadAuthorization, jobOwnership, requirePermission(PERMISSIONS.QUOTATION_SUBMIT)] }, quotationController.transition)
  app.post('/jobs/:jobId/quotation/review', { preHandler: [authMiddleware, loadAuthorization, jobOwnership, requirePermission(PERMISSIONS.QUOTATION_REVIEW)] }, quotationController.transition)
}
