import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const mocks = vi.hoisted(() => ({ specData: undefined as unknown }))

vi.mock('@/api/quotation/spec/getSpec', () => ({
  useSpec: () => ({ data: mocks.specData }),
}))

import { Step9Spec } from '@/components/quotation/steps/Step9Spec'
import { useQuotationStore } from '@/stores/quotation-store'

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
    expect(screen.getByText('No products added yet.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add product' })).toBeInTheDocument()
  })
})
