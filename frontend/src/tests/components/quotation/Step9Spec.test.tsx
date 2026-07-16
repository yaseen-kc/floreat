import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

const mocks = vi.hoisted(() => ({ specData: undefined as unknown }))

vi.mock('@/api/quotation/spec/getSpec', () => ({
  useSpec: () => ({ data: mocks.specData }),
}))

import { Step9Spec } from '@/components/quotation/steps/Step9Spec'
import { DEFAULT_SPEC_PRODUCTS, useQuotationStore } from '@/stores/quotation-store'

describe('Step9Spec', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.specData = undefined
  })

  it('renders the step heading and the products table section', () => {
    render(<Step9Spec />)
    expect(screen.getByRole('heading', { name: 'Product specification' })).toBeInTheDocument()
    expect(screen.getByText('Product Specification')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Fabricated Columns and Beams')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add product' })).toBeInTheDocument()
  })

  it('replaces the untouched seeded draft with fetched server data', async () => {
    mocks.specData = {
      id: 'spec-1',
      jobId: 'job-1',
      createdAt: '',
      updatedAt: '',
      products: [
        {
          id: 'product-1',
          code: 'PRODUCT-1',
          description: 'Server Steel',
          specification: 'IS 2062',
          makeOrBrand: 'TATA',
          yieldStrengthMpa: 345,
        },
      ],
    }

    useQuotationStore.getState().setJobId('job-1')
    render(<Step9Spec />)

    await waitFor(() =>
      expect(useQuotationStore.getState().spec.products).toEqual([
        {
          code: 'PRODUCT-1',
          description: 'Server Steel',
          specification: 'IS 2062',
          makeOrBrand: 'TATA',
          yieldStrengthMpa: 345,
        },
      ]),
    )
  })

  it('does not overwrite a locally edited draft when server data arrives', async () => {
    mocks.specData = {
      id: 'spec-1',
      jobId: 'job-1',
      createdAt: '',
      updatedAt: '',
      products: [
        {
          id: 'product-1',
          code: 'PRODUCT-1',
          description: 'Server Steel',
          specification: 'IS 2062',
          makeOrBrand: 'TATA',
          yieldStrengthMpa: 345,
        },
      ],
    }

    useQuotationStore.getState().setJobId('job-1')
    useQuotationStore.getState().setSpec({
      products: [
        {
          code: 'PRODUCT-1',
          ...DEFAULT_SPEC_PRODUCTS[0],
          description: 'Edited locally',
        },
        ...DEFAULT_SPEC_PRODUCTS.slice(1).map((product, index) => ({
          code: `PRODUCT-${index + 2}`,
          ...product,
        })),
      ],
    })

    render(<Step9Spec />)

    await waitFor(() =>
      expect(useQuotationStore.getState().spec.products[0].description).toBe('Edited locally'),
    )
  })
})
