/**
 * Fastify type augmentations.
 * Extends the FastifyRequest interface with custom properties used across the app.
 */
import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    /** Clerk user ID extracted by the auth middleware */
    userId: string
  }
}
