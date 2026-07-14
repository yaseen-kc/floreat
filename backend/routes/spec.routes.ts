import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/auth.js'
import * as specController from '../controllers/spec.controller.js'

/** Global product-specification route definitions. */
export async function specRoutes(app: FastifyInstance) {
  const writeLimit = { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }
  const read = { preHandler: [authMiddleware] }
  const write = { preHandler: [authMiddleware], ...writeLimit }

  app.post('/specs', write, specController.create)
  app.get('/specs', read, specController.getAll)
  app.get('/specs/:id', read, specController.getById)
  app.put('/specs/:id', write, specController.update)
  app.delete('/specs/:id', write, specController.remove)
}
