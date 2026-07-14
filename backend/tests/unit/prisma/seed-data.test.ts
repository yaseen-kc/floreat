import { describe, expect, it } from 'vitest'
import { createSpecSchema } from '../../../schemas/spec.schema.js'
import { specSeedData } from '../../../prisma/seed-data.js'

const originalSpecIds = [
  'spec-fabricated-columns-beams',
  'spec-cold-formed-purlins-girts',
  'spec-roofing-sheet',
  'spec-cladding-sheet',
  'spec-decking-sheet',
  'spec-primary-connection',
  'spec-secondary-connection',
]

const addedSpecIds = [
  'spec-structural-steel-sections',
  'spec-high-strength-bolts',
  'spec-insulated-roofing-panels',
  'spec-wall-cladding-panels',
  'spec-thermal-insulation-material',
  'spec-protective-paint-coating',
  'spec-foundation-materials',
  'spec-doors-windows-accessories',
]

describe('Spec seed data', () => {
  it('contains the seven original and eight added records', () => {
    expect(specSeedData).toHaveLength(15)
    expect(specSeedData.map(({ id }) => id)).toEqual([...originalSpecIds, ...addedSpecIds])
  })

  it('contains unique ids', () => {
    const ids = specSeedData.map(({ id }) => id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(specSeedData)('validates $id against the shared Spec schema', (spec) => {
    const { id, ...data } = spec
    const result = createSpecSchema.safeParse(data)

    expect(result.success, `${id} failed validation: ${result.success ? '' : result.error.message}`).toBe(true)
  })
})
