import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { clerkPlugin } from '@clerk/fastify'
import { config } from '../../config/index.js'
import { registerRoutes } from '../../routes/index.js'

interface BuildAppOptions {
  rateLimit?: { max: number; timeWindow: string }
}

/**
 * Builds a Fastify instance mirroring server.ts for integration tests.
 * Rate-limit defaults to config (high in .env.test so suites don't trip);
 * pass `rateLimit` to override with a low ceiling for 429 assertions.
 */
export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify()
  app.decorateRequest('userId', '')
  await app.register(helmet)
  await app.register(cors)
  await app.register(rateLimit, options.rateLimit ?? config.rateLimit)
  await app.register(clerkPlugin)
  await registerRoutes(app)
  await app.ready()
  return app
}
