/** Job-owned rate routes. */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { jobOwnership } from '../middlewares/job-ownership.js'
import * as rateController from '../controllers/rate.controller.js'
import { requirePermission } from '../middlewares/authorization.js'
import { syncUser } from '../middlewares/sync-user.js'
import { loadAuthorization } from '../middlewares/authorization.js'
import { PERMISSIONS } from '../auth/authorization.js'

export async function rateRoutes(app: FastifyInstance) {
  const writeLimit = { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }
  const read = { preHandler: [authMiddleware, jobOwnership] }
  const write = { preHandler: [authMiddleware, syncUser, loadAuthorization, requirePermission(PERMISSIONS.RATE_MANAGE), jobOwnership], ...writeLimit }
  app.post('/jobs/:jobId/rates', write, rateController.create)
  app.put('/jobs/:jobId/rates/bulk', write, rateController.replaceAll)
  app.get('/jobs/:jobId/rates', read, rateController.getAll)
  app.get('/jobs/:jobId/rates/:id', read, rateController.getById)
  app.put('/jobs/:jobId/rates/:id', write, rateController.update)
  app.delete('/jobs/:jobId/rates/:id', write, rateController.remove)
}
