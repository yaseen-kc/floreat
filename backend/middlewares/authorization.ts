import type { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { can, permissionsForRole, type Permission } from '../auth/authorization.js'
import { sendError } from '../utils/response.js'

export async function loadAuthorization(request: FastifyRequest, reply: FastifyReply) {
  const user = await prisma.user.findUnique({ where: { clerkId: request.userId }, select: { role: true, status: true } })
  if (!user && !request.role) return sendError(reply, 403, 'Local user is not provisioned')
  if (user?.status === 'DEACTIVATED') return sendError(reply, 403, 'User account is deactivated')
  const role = user?.role ?? request.role ?? 'ESTIMATOR'
  request.role = role
  request.permissions = permissionsForRole(role)
}

export function requirePermission(permission: Permission) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.role) await loadAuthorization(request, reply)
    if (reply.sent) return
    if (!can(request.role, permission)) return sendError(reply, 403, 'Forbidden')
  }
}
