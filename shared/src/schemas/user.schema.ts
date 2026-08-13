import { z } from 'zod'

export const appRoleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'ESTIMATOR', 'SALES_COORDINATOR'])
export const userStatusSchema = z.enum(['ACTIVE', 'DEACTIVATED'])
export const userInvitationStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED'])

export const createUserInvitationSchema = z.object({
  email: z.string().trim().email().max(320),
  role: appRoleSchema,
})
export const userRoleSchema = z.object({ role: appRoleSchema })
export const userClerkIdParamsSchema = z.object({ clerkId: z.string().min(1) })
export const invitationIdParamsSchema = z.object({ id: z.string().min(1) })
export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
  search: z.string().trim().max(200).optional(),
  role: appRoleSchema.optional(),
  status: userStatusSchema.optional(),
  invitationStatus: userInvitationStatusSchema.optional(),
})

export type AppRole = z.infer<typeof appRoleSchema>
export type UserStatus = z.infer<typeof userStatusSchema>
export type UserInvitationStatus = z.infer<typeof userInvitationStatusSchema>
export type CreateUserInvitationInput = z.infer<typeof createUserInvitationSchema>
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>
