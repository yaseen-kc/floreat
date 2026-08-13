/**
 * Fastify type augmentations.
 * Extends the FastifyRequest interface with custom properties used across the app.
 */
import 'fastify'
import type { Role } from '../generated/prisma/client.js'
import type { Permission } from '../auth/authorization.js'

declare module 'fastify' {
  interface FastifyRequest {
    /** Clerk user ID extracted by the auth middleware */
    userId: string
    role: Role
    permissions: Permission[]
  }
}
