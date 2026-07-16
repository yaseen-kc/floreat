/**
 * Rate route definitions — plain REST for the global rate master table
 * (`/rates`, `/rates/:id`). Rate is top-level reference data (not job-scoped),
 * so routes require authentication but no per-job ownership check.
 *
 * NOTE: any authenticated user can mutate this global pricing master-data —
 * there is no admin/role gate in the current standards. Add one here if rate
 * writes should be restricted.
 */
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as rateController from '../controllers/rate.controller.js'

export async function rateRoutes(app: FastifyInstance) {
  const writeLimit = { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }
  const write = { preHandler: [authMiddleware], ...writeLimit }

  app.post('/rates', write, rateController.create)
  app.get('/rates', { preHandler: [authMiddleware] }, rateController.getAll)
  app.get('/rates/:id', { preHandler: [authMiddleware] }, rateController.getById)
  app.put('/rates/:id', write, rateController.update)
  app.delete('/rates/:id', write, rateController.remove)
}
