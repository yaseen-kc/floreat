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
