/**
 * Application entry point.
 * Bootstraps Fastify with security headers, CORS, rate limiting, Clerk auth, and API routes.
 */
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { clerkPlugin } from '@clerk/fastify'
import { config } from './config/index.js'
import { registerRoutes } from './routes/index.js'
import { registerDevelopmentDocs } from './docs/plugin.js'

const fastify = Fastify({ logger: true })

// Attach userId placeholder so Fastify recognizes the decorated property
fastify.decorateRequest('userId', '')

// Security response headers (X-Content-Type-Options, X-Frame-Options, HSTS, etc.)
await fastify.register(helmet)

// Exact-match origin allowlist (config.corsOrigins); credentials require a
// non-wildcard allowlist, enforced at config load (see resolveCorsOrigin).
await fastify.register(cors, {
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

// Global request throttling; tighter per-route limits are set on auth-adjacent routes
if (config.rateLimit.enabled) {
  await fastify.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
  })
}

await fastify.register(clerkPlugin)
if (config.docs.enabled) await registerDevelopmentDocs(fastify)
await registerRoutes(fastify)

try {
  await fastify.listen({ port: config.port })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
