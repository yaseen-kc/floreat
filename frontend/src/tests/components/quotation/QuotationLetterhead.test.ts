import { describe, expect, it } from 'vitest'

import { buildQuotationData } from '@/components/quotation/sections/quotation/QuotationLetterhead'

describe('buildQuotationData', () => {
  it('maps refNo into the reference and offer sentence', () => {
    const data = buildQuotationData({ refNo: 'JOB-42' })

    expect(data.META.ref).toBe('JOB-42')
    expect(data.META.reference).toBe('JOB-42')
    expect(data.LETTER_BODY[1]).toContain('offer no. JOB-42.')
  })

  it('formats valid ISO dates and preserves invalid values', () => {
    expect(buildQuotationData({ date: '2026-01-05' }).META.date).toBe('5 January 2026')
    expect(buildQuotationData({ date: '2026-07-28T00:00:00.000Z' }).META.date).toBe('2026-07-28')
    expect(buildQuotationData({ date: '2026-02-30' }).META.date).toBe('2026-02-30')
    expect(buildQuotationData({ date: 'not-a-date' }).META.date).toBe('not-a-date')
  })

  it('uses Not provided for missing, null, and empty values', () => {
    const data = buildQuotationData({
      clientName: null, firmName: ' ', estimationEngineerName: undefined,
      estimationEngineerMobile: '', headOfSalesName: null, headOfSalesMobile: undefined,
    })

    expect(data.META.client).toBe('Not provided')
    expect(data.META.company).toBe('Not provided')
    expect(data.SIGNATORIES).toEqual([
      { name: 'Not provided', role: 'Estimation Engineer', mobile: 'Not provided' },
      { name: 'Not provided', role: 'Head of Sales', mobile: 'Not provided' },
    ])
  })
})
