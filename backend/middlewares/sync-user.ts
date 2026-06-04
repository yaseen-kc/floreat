import { FastifyRequest, FastifyReply } from 'fastify'
import { clerkClient } from '@clerk/fastify'
import { prisma } from '../lib/prisma.js'

export async function syncUser(request: FastifyRequest, _reply: FastifyReply) {
  const existing = await prisma.user.findUnique({ where: { clerkId: request.userId } })
  if (existing) return

  const clerkUser = await clerkClient.users.getUser(request.userId)
  await prisma.user.create({
    data: {
      clerkId: request.userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
  })
}
