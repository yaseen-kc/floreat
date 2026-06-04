/**
 * User controller — handles HTTP request/response logic for user endpoints.
 * Delegates business logic to the user service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { getUserByClerkId } from '../services/user.service.js'

/** Returns the currently authenticated user's profile data. */
export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const user = await getUserByClerkId(request.userId)
  return reply.send(user)
}
