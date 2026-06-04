/**
 * Route registry — registers all route modules with their prefixes.
 * Add new route files here as the API grows.
 */
/**
 * Route registry — registers all route modules with their prefixes.
 * Add new route files here as the API grows.
 */
import { FastifyInstance } from 'fastify'
import { userRoutes } from './user.routes.js'
import { jobRoutes } from './job.routes.js'

export async function registerRoutes(app: FastifyInstance) {
  await app.register(userRoutes, { prefix: '/api' })
  await app.register(jobRoutes, { prefix: '/api' })
}
