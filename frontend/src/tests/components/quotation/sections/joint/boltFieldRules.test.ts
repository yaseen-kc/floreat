import { describe, it, expect } from 'vitest'
import {
  boltDiameterRule,
  boltCountRule,
} from '@/components/quotation/sections/joint/boltFieldRules'

describe('boltDiameterRule', () => {
  it('leaves only Roof Joint A editable', () => {
    expect(boltDiameterRule('roof', 'A').readOnly).toBe(false)
    expect(boltDiameterRule('roof', 'B')).toEqual({ readOnly: true, hint: 'Follows Joint A' })
    expect(boltDiameterRule('roof', 'L_1').readOnly).toBe(true)
  })

  it('locks every mezzanine diameter to Joint A', () => {
    expect(boltDiameterRule('mezzanine', 'M')).toEqual({ readOnly: true, hint: 'Follows Joint A' })
    expect(boltDiameterRule('mezzanine', 'SEC').readOnly).toBe(true)
  })

  it('leaves foundation diameters editable', () => {
    expect(boltDiameterRule('foundation', 'FB4').readOnly).toBe(false)
  })
})

describe('boltCountRule', () => {
  it('fixes roof F=4 and J=8 with a fallback value', () => {
    expect(boltCountRule('roof', 'F')).toEqual({ readOnly: true, hint: 'Fixed at 4', fixedValue: 4 })
    expect(boltCountRule('roof', 'J')).toEqual({ readOnly: true, hint: 'Fixed at 8', fixedValue: 8 })
  })

  it('mirrors roof E from D', () => {
    expect(boltCountRule('roof', 'E')).toEqual({ readOnly: true, hint: 'Follows D' })
  })

  it('mirrors mezzanine N from M and R from Q', () => {
    expect(boltCountRule('mezzanine', 'N')).toEqual({ readOnly: true, hint: 'Follows M' })
    expect(boltCountRule('mezzanine', 'R')).toEqual({ readOnly: true, hint: 'Follows Q' })
  })

  it('leaves independent counts editable', () => {
    expect(boltCountRule('roof', 'A').readOnly).toBe(false)
    expect(boltCountRule('roof', 'D').readOnly).toBe(false)
    expect(boltCountRule('mezzanine', 'M').readOnly).toBe(false)
    expect(boltCountRule('foundation', 'FB4').readOnly).toBe(false)
  })
})
