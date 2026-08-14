import type { Role } from '../generated/prisma/client.js'

export const ROLES = ['SUPER_ADMIN', 'ADMIN', 'ESTIMATOR', 'SALES_COORDINATOR'] as const
export type AppRole = (typeof ROLES)[number]

export const PERMISSIONS = {
  QUOTATION_CREATE: 'quotation:create',
  QUOTATION_READ: 'quotation:read',
  QUOTATION_UPDATE: 'quotation:update',
  QUOTATION_DELETE: 'quotation:delete',
  QUOTATION_SUBMIT: 'quotation:submit',
  QUOTATION_REVIEW: 'quotation:review',
  JOB_ACCESS: 'job:access',
  QUOTATION_DATA_ACCESS: 'quotation-data:access',
  RATE_MANAGE: 'rate:manage',
  USER_LIST: 'user:list',
  USER_INVITE: 'user:invite',
  USER_ROLE_ASSIGN: 'user:role:assign',
  USER_DEACTIVATE: 'user:deactivate',
  USER_REACTIVATE: 'user:reactivate',
  USER_INVITATION_RESEND: 'user:invitation:resend',
  USER_INVITATION_REVOKE: 'user:invitation:revoke',
  ROLE_ASSIGN: 'user:role:assign',
  ADMIN_MANAGE: 'admin:manage',
  SOFT_DELETE_RESTORE: 'soft-delete:restore',
} as const
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const all = Object.values(PERMISSIONS) as Permission[]
export const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  SUPER_ADMIN: all,
  ADMIN: all.filter((p) => p !== PERMISSIONS.ADMIN_MANAGE),
  ESTIMATOR: [PERMISSIONS.QUOTATION_CREATE, PERMISSIONS.QUOTATION_READ, PERMISSIONS.QUOTATION_UPDATE, PERMISSIONS.QUOTATION_DELETE, PERMISSIONS.QUOTATION_SUBMIT, PERMISSIONS.QUOTATION_REVIEW, PERMISSIONS.JOB_ACCESS, PERMISSIONS.QUOTATION_DATA_ACCESS, PERMISSIONS.RATE_MANAGE],
  SALES_COORDINATOR: [PERMISSIONS.QUOTATION_CREATE, PERMISSIONS.QUOTATION_READ, PERMISSIONS.QUOTATION_UPDATE, PERMISSIONS.QUOTATION_DELETE, PERMISSIONS.QUOTATION_SUBMIT, PERMISSIONS.JOB_ACCESS, PERMISSIONS.QUOTATION_DATA_ACCESS, PERMISSIONS.RATE_MANAGE],
}

export function permissionsForRole(role: Role | AppRole): Permission[] {
  return [...ROLE_PERMISSIONS[role as AppRole]]
}

export function can(role: Role | AppRole, permission: Permission) {
  return ROLE_PERMISSIONS[role as AppRole].includes(permission)
}

export function canAssignRole(actor: AppRole, target: AppRole) {
  return actor === 'SUPER_ADMIN' || (actor === 'ADMIN' && target !== 'SUPER_ADMIN' && target !== 'ADMIN')
}

export function canManageUser(actor: AppRole, target: AppRole) {
  return actor === 'SUPER_ADMIN' || (actor === 'ADMIN' && target !== 'SUPER_ADMIN' && target !== 'ADMIN')
}

export function isGlobalRole(role: AppRole) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}
