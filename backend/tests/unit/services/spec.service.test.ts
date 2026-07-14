import { describe, expect, it } from 'vitest'
import '../../../tests/mocks/prisma.js'
import { prismaMock } from '../../mocks/prisma.js'
import { makeSpec, makeSpecInput } from '../../helpers/factories.js'
import { createSpec, deleteSpec, getSpecById, getSpecs, updateSpec } from '../../../services/spec.service.js'

describe('spec.service', () => {
  it('creates a global specification', async () => {
    const input = makeSpecInput()
    const spec = makeSpec(input)
    prismaMock.spec.create.mockResolvedValue(spec as any)

    const result = await createSpec(input)

    expect(result).toEqual(spec)
    expect(prismaMock.spec.create).toHaveBeenCalledWith({ data: input })
  })

  it('returns a paginated specification list', async () => {
    const specs = [makeSpec(), makeSpec()]
    prismaMock.spec.findMany.mockResolvedValue(specs as any)
    prismaMock.spec.count.mockResolvedValue(2)

    const result = await getSpecs(2, 10)

    expect(result).toEqual({ data: specs, total: 2, page: 2, pageSize: 10 })
    expect(prismaMock.spec.findMany).toHaveBeenCalledWith({
      skip: 10,
      take: 10,
      orderBy: { createdAt: 'desc' },
    })
    expect(prismaMock.spec.count).toHaveBeenCalledWith()
  })

  it('returns a specification by ID', async () => {
    const spec = makeSpec()
    prismaMock.spec.findUnique.mockResolvedValue(spec as any)

    const result = await getSpecById(spec.id)

    expect(result).toEqual(spec)
    expect(prismaMock.spec.findUnique).toHaveBeenCalledWith({ where: { id: spec.id } })
  })

  it('updates a specification by ID', async () => {
    const spec = makeSpec()
    const data = { description: 'Updated description' }
    prismaMock.spec.update.mockResolvedValue(spec as any)

    const result = await updateSpec(spec.id, data)

    expect(result).toEqual(spec)
    expect(prismaMock.spec.update).toHaveBeenCalledWith({ where: { id: spec.id }, data })
  })

  it('deletes a specification by ID', async () => {
    const spec = makeSpec()
    prismaMock.spec.delete.mockResolvedValue(spec as any)

    await deleteSpec(spec.id)

    expect(prismaMock.spec.delete).toHaveBeenCalledWith({ where: { id: spec.id } })
  })
})
