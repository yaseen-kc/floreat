/**
 * Joint route definitions.
 * Nested under /jobs/:jobId/joint for single-job operations,
 * plus a flat /joints endpoint for paginated listing.
 * All routes require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as jointController from '../controllers/joint.controller.js'

export async function jointRoutes(app: FastifyInstance) {
  const owned = { preHandler: [authMiddleware, jobOwnership] }
  app.post('/jobs/:jobId/joint', owned, jointController.upsert)
  app.get('/jobs/:jobId/joint', owned, jointController.getByJobId)
  app.put('/jobs/:jobId/joint', owned, jointController.update)
  app.delete('/jobs/:jobId/joint', owned, jointController.remove)
  app.get('/joints', { preHandler: [authMiddleware] }, jointController.getAll)
}
