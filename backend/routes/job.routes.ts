/**
 * Job route definitions.
 * All routes here require authentication before handling.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import { syncUser } from '../middlewares/sync-user.js'
import * as jobController from '../controllers/job.controller.js'
import { loadAuthorization } from '../middlewares/authorization.js'

export async function jobRoutes(app: FastifyInstance) {
  // Tighter rate limit on write routes (resource-mutating / auth-adjacent).
  const writeLimit = { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }
  // Create chains syncUser so the local User row (FK target for Job.userId) exists.
  const auth = [authMiddleware, syncUser, loadAuthorization]
  app.post('/jobs', { preHandler: auth, ...writeLimit }, jobController.create)
  app.get('/jobs', { preHandler: auth }, jobController.getAll)
  app.get('/jobs/:id', { preHandler: auth }, jobController.getById)
  app.get('/jobs/:jobId/all', { preHandler: auth }, jobController.getAllDataByJobId)
  app.put('/jobs/:id', { preHandler: auth, ...writeLimit }, jobController.update)
  app.delete('/jobs/:id', { preHandler: auth, ...writeLimit }, jobController.remove)
}
