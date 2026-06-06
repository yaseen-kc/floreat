import { describe, it, expect } from 'vitest'
import '../../mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeUser } from '../../helpers/factories.js'
import { getUserByClerkId } from '../../../services/user.service.js'

describe('user.service', () => {
  it('returns user when found', async () => {
    const user = makeUser()
    prismaMock.user.findUnique.mockResolvedValue(user as any)

    const result = await getUserByClerkId(user.clerkId)

    expect(result).toEqual(user)
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { clerkId: user.clerkId } })
  })

  it('returns null when not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    const result = await getUserByClerkId('nonexistent')

    expect(result).toBeNull()
  })
})
