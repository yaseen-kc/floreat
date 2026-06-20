/**
 * Application entry point.
 * Bootstraps Fastify with CORS, Clerk auth plugin, and API routes.
 */
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { clerkPlugin } from '@clerk/fastify'
import { config } from './config/index.js'
import { registerRoutes } from './routes/index.js'

const fastify = Fastify({ logger: true })

// Attach userId placeholder so Fastify recognizes the decorated property
fastify.decorateRequest('userId', '')

await fastify.register(cors, {
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

await fastify.register(clerkPlugin)
await registerRoutes(fastify)

try {
  await fastify.listen({ port: config.port })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
