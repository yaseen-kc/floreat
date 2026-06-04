/**
 * User service — encapsulates database operations for the User model.
 * Keep business logic and queries here, separate from HTTP concerns.
 */
import { prisma } from '../lib/prisma.js'

/** Finds a user by their Clerk authentication ID. Returns null if not found. */
export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } })
}
