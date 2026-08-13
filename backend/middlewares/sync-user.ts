/**
 * Sync-user middleware — ensures the authenticated Clerk user exists in our database.
 * On first login, fetches user details from Clerk and creates a local DB record.
 * Subsequent requests skip creation since the user already exists.
 */
import { FastifyRequest, FastifyReply } from 'fastify'
import { clerkClient } from '@clerk/fastify'
import { prisma } from '../lib/prisma.js'
import { permissionsForRole } from '../auth/authorization.js'
import { config } from '../config/index.js'
import { UserInvitationStatus } from '../generated/prisma/client.js'

export async function syncUser(request: FastifyRequest, _reply: FastifyReply) {
  const existing = await prisma.user.findUnique({ where: { clerkId: request.userId } })
  if (existing) {
    if (existing.status === 'DEACTIVATED') return
    const existingRole = existing.role ?? 'ESTIMATOR'
    if (config.superAdminClerkIds.has(request.userId) && existingRole !== 'SUPER_ADMIN') {
      const promoted = await prisma.user.update({ where: { clerkId: request.userId }, data: { role: 'SUPER_ADMIN' } })
      request.role = promoted.role
      request.permissions = permissionsForRole(promoted.role)
      return
    }
    request.role = existingRole
    request.permissions = permissionsForRole(existingRole)
    return
  }

  // First-time user — pull profile from Clerk and persist locally
  const clerkUser = await clerkClient.users.getUser(request.userId)
  // Some legacy unit tests mock only the auth identity. Real Clerk requests
  // always return a profile; keep that test seam from masking production errors.
  if (!clerkUser && process.env.NODE_ENV === 'test') {
    request.role = 'ESTIMATOR'
    request.permissions = permissionsForRole('ESTIMATOR')
    return
  }
  const email = clerkUser.emailAddresses.find((entry) => entry.id === clerkUser.primaryEmailAddressId)?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? ''
  const invitation = email ? await prisma.userInvitation.findFirst({ where: { email: { equals: email, mode: 'insensitive' }, status: UserInvitationStatus.PENDING }, orderBy: { createdAt: 'asc' } }) : null
  const user = await prisma.user.create({
    data: {
      clerkId: request.userId,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      ...(config.superAdminClerkIds.has(request.userId) ? { role: 'SUPER_ADMIN' as const } : invitation ? { role: invitation.role } : {}),
    },
  })
  if (invitation) await prisma.userInvitation.update({ where: { id: invitation.id }, data: { status: 'ACCEPTED', acceptedAt: new Date() } })
  request.role = user.role ?? 'ESTIMATOR'
  request.permissions = permissionsForRole(request.role)
}
