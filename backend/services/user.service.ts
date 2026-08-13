import { clerkClient } from '@clerk/fastify'
import type { AppRole, CreateUserInvitationInput, ListUsersQuery, UserStatus } from '@floreat/shared/schemas'
import { canManageUser } from '../auth/authorization.js'
import { prisma } from '../lib/prisma.js'

export class UserDomainError extends Error {
  constructor(public readonly status: 403 | 404 | 409, message: string) { super(message) }
}

export function getUserByClerkId(clerkId: string) { return prisma.user.findUnique({ where: { clerkId } }) }

function assertTarget(actor: AppRole, target: { role: AppRole } | null) {
  if (!target) throw new UserDomainError(404, 'User not found')
  if (!canManageUser(actor, target.role)) throw new UserDomainError(403, 'Forbidden')
}

export async function listUsers(query: ListUsersQuery) {
  const where = {
    ...(query.role ? { role: query.role } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.search ? { OR: [{ email: { contains: query.search, mode: 'insensitive' as const } }, { firstName: { contains: query.search, mode: 'insensitive' as const } }, { lastName: { contains: query.search, mode: 'insensitive' as const } }] } : {}),
  }
  const [users, invitations, total] = await prisma.$transaction([
    prisma.user.findMany({ where, orderBy: [{ email: 'asc' }, { clerkId: 'asc' }], skip: (query.page - 1) * query.pageSize, take: query.pageSize }),
    prisma.userInvitation.findMany({ where: query.invitationStatus ? { status: query.invitationStatus } : undefined, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 100 }),
    prisma.user.count({ where }),
  ])
  return { users, invitations, pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) } }
}

export async function setUserRole(actorId: string, actor: AppRole, clerkId: string, role: AppRole) {
  const target = await prisma.user.findUnique({ where: { clerkId }, select: { role: true } })
  assertTarget(actor, target)
  if (target?.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') await assertNotFinalSuperAdmin()
  if (clerkId === actorId && role !== 'SUPER_ADMIN' && actor === 'SUPER_ADMIN') await assertNotFinalSuperAdmin()
  return prisma.user.update({ where: { clerkId }, data: { role } })
}

async function assertNotFinalSuperAdmin() {
  const count = await prisma.user.count({ where: { role: 'SUPER_ADMIN', status: 'ACTIVE' } })
  if (count <= 1) throw new UserDomainError(409, 'The final active SuperAdmin cannot be removed')
}

export async function createInvitation(actorId: string, actor: AppRole, input: CreateUserInvitationInput) {
  if (!canManageUser(actor, input.role)) throw new UserDomainError(403, 'Forbidden')
  const email = input.email.toLowerCase()
  const [existingUser, existingInvitation] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.userInvitation.findFirst({ where: { email, status: 'PENDING' } }),
  ])
  if (existingUser || existingInvitation) throw new UserDomainError(409, 'A user or active invitation already exists for this email')
  const invitation = await clerkClient.invitations.createInvitation({ emailAddress: email, notify: true, publicMetadata: { floreatRole: input.role } })
  return prisma.userInvitation.create({ data: { email, clerkInvitationId: invitation.id, role: input.role, invitedById: actorId, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } })
}

async function getInvitationForActor(actor: AppRole, id: string) {
  const invitation = await prisma.userInvitation.findUnique({ where: { id } })
  if (!invitation) throw new UserDomainError(404, 'Invitation not found')
  if (!canManageUser(actor, invitation.role)) throw new UserDomainError(403, 'Forbidden')
  return invitation
}

export async function resendInvitation(_actorId: string, actor: AppRole, id: string) {
  const old = await getInvitationForActor(actor, id)
  if (old.status !== 'PENDING') throw new UserDomainError(409, 'Only pending invitations can be resent')
  const invitation = await clerkClient.invitations.createInvitation({ emailAddress: old.email, notify: true, publicMetadata: { floreatRole: old.role } })
  return prisma.userInvitation.update({ where: { id }, data: { clerkInvitationId: invitation.id, createdAt: new Date(), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } })
}

export async function revokeInvitation(_actorId: string, actor: AppRole, id: string) {
  const old = await getInvitationForActor(actor, id)
  if (old.status !== 'PENDING') throw new UserDomainError(409, 'Only pending invitations can be revoked')
  await clerkClient.invitations.revokeInvitation(old.clerkInvitationId)
  return prisma.userInvitation.update({ where: { id }, data: { status: 'REVOKED', revokedAt: new Date() } })
}

export async function setUserStatus(actorId: string, actor: AppRole, clerkId: string, status: UserStatus) {
  const target = await prisma.user.findUnique({ where: { clerkId }, select: { role: true, status: true } })
  assertTarget(actor, target)
  if (status === 'DEACTIVATED' && target?.role === 'SUPER_ADMIN') await assertNotFinalSuperAdmin()
  if (clerkId === actorId && status === 'DEACTIVATED') throw new UserDomainError(409, 'You cannot deactivate your own account')
  if (status === 'DEACTIVATED') await clerkClient.users.banUser(clerkId)
  else await clerkClient.users.unbanUser(clerkId)
  return prisma.user.update({ where: { clerkId }, data: { status } })
}
