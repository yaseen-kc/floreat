/**
 * User controller — handles HTTP request/response logic for user endpoints.
 * Delegates business logic to the user service layer.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { getUserByClerkId } from '../services/user.service.js'
import * as userService from '../services/user.service.js'
import { createUserInvitationSchema, invitationIdParamsSchema, listUsersQuerySchema, userClerkIdParamsSchema, userRoleSchema } from '@floreat/shared/schemas'
import { sendError } from '../utils/response.js'

/** Returns the currently authenticated user's profile data. */
export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const user = await getUserByClerkId(request.userId)
  return reply.send({ ...user, role: request.role, permissions: request.permissions })
}

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const query = listUsersQuerySchema.parse(request.query)
  return reply.send(await userService.listUsers(query))
}

export async function assignRole(request: FastifyRequest, reply: FastifyReply) {
  const { clerkId } = userClerkIdParamsSchema.parse(request.params)
  const { role } = userRoleSchema.parse(request.body)
  return reply.send(await userService.setUserRole(request.userId, request.role, clerkId, role))
}

function domainError(reply: FastifyReply, error: unknown) {
  if (error instanceof userService.UserDomainError) return sendError(reply, error.status, error.message)
  if ((error as { code?: string })?.code === 'P2025') return sendError(reply, 404, 'User or invitation not found')
  throw error
}

export async function inviteUser(request: FastifyRequest, reply: FastifyReply) {
  try { return reply.code(201).send(await userService.createInvitation(request.userId, request.role, createUserInvitationSchema.parse(request.body))) } catch (error) { return domainError(reply, error) }
}
export async function resendInvitation(request: FastifyRequest, reply: FastifyReply) {
  try { const { id } = invitationIdParamsSchema.parse(request.params); return reply.send(await userService.resendInvitation(request.userId, request.role, id)) } catch (error) { return domainError(reply, error) }
}
export async function revokeInvitation(request: FastifyRequest, reply: FastifyReply) {
  try { const { id } = invitationIdParamsSchema.parse(request.params); return reply.send(await userService.revokeInvitation(request.userId, request.role, id)) } catch (error) { return domainError(reply, error) }
}
export async function deactivateUser(request: FastifyRequest, reply: FastifyReply) {
  try { const { clerkId } = userClerkIdParamsSchema.parse(request.params); return reply.send(await userService.setUserStatus(request.userId, request.role, clerkId, 'DEACTIVATED')) } catch (error) { return domainError(reply, error) }
}
export async function reactivateUser(request: FastifyRequest, reply: FastifyReply) {
  try { const { clerkId } = userClerkIdParamsSchema.parse(request.params); return reply.send(await userService.setUserStatus(request.userId, request.role, clerkId, 'ACTIVE')) } catch (error) { return domainError(reply, error) }
}
