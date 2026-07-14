/**
 * Route registry — registers all route modules with their prefixes.
 * Add new route files here as the API grows.
 */
/**
 * Route registry — registers all route modules with their prefixes.
 * Add new route files here as the API grows.
 */
import { FastifyInstance } from 'fastify'
import { healthRoutes } from './health.routes.js'
import { userRoutes } from './user.routes.js'
import { jobRoutes } from './job.routes.js'
import { roofRoutes } from './roof.routes.js'
import { mezzanineRoutes } from './mezzanine.routes.js'
import { stairRoutes } from './stair.routes.js'
import { canopyRoutes } from './canopy.routes.js'
import { loadRoutes } from './load.routes.js'
import { accessoriesRoutes } from './accessories.routes.js'
import { jointRoutes } from './joint.routes.js'

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes, { prefix: '/api' })
  await app.register(userRoutes, { prefix: '/api' })
  await app.register(jobRoutes, { prefix: '/api' })
  await app.register(roofRoutes, { prefix: '/api' })
  await app.register(mezzanineRoutes, { prefix: '/api' })
  await app.register(stairRoutes, { prefix: '/api' })
  await app.register(canopyRoutes, { prefix: '/api' })
  await app.register(loadRoutes, { prefix: '/api' })
  await app.register(accessoriesRoutes, { prefix: '/api' })
  await app.register(jointRoutes, { prefix: '/api' })
}
