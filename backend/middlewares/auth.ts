/**
 * Auth middleware — verifies the Clerk session token on incoming requests.
 * Extracts userId from the token and attaches it to the request object.
 * Returns 401 if the user is not authenticated.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { getAuth } from '@clerk/fastify'

declare module 'fastify' {
  interface FastifyRequest {
    userId: string
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const { userId } = getAuth(request)
  if (!userId) return reply.code(401).send({ error: 'Unauthorized' })
  request.userId = userId
}
