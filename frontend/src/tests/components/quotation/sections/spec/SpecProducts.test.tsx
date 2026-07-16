import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SpecProducts } from '@/components/quotation/sections/spec/SpecProducts'
import { DEFAULT_SPEC_PRODUCTS, useQuotationStore } from '@/stores/quotation-store'

describe('SpecProducts section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders the seeded default product descriptions on first load', () => {
    render(<SpecProducts />)
    expect(screen.getByText('Product Specification')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Fabricated Columns and Beams')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Decking Sheet')).toBeInTheDocument()
  })

  it('adds a product row and reassigns its code', () => {
    render(<SpecProducts />)
    fireEvent.click(screen.getByRole('button', { name: 'Add product' }))
    expect(useQuotationStore.getState().spec.products).toEqual([
      ...DEFAULT_SPEC_PRODUCTS.map((product, index) => ({
        code: `PRODUCT-${index + 1}`,
        ...product,
      })),
      { code: `PRODUCT-${DEFAULT_SPEC_PRODUCTS.length + 1}` },
    ])
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('writes an edited cell into the store', () => {
    render(<SpecProducts />)
    fireEvent.change(screen.getByLabelText('Product 1 description'), { target: { value: 'Structural steel' } })
    fireEvent.change(screen.getByLabelText('Product 1 yield strength'), { target: { value: '345' } })
    const [product] = useQuotationStore.getState().spec.products
    expect(product.description).toBe('Structural steel')
    expect(product.yieldStrengthMpa).toBe(345)
  })

  it('shows the empty state after all product rows are removed', () => {
    render(<SpecProducts />)
    for (let i = 0; i < DEFAULT_SPEC_PRODUCTS.length; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Remove product 1' }))
    }
    expect(useQuotationStore.getState().spec.products).toEqual([])
    expect(screen.getByText('No products added yet.')).toBeInTheDocument()
  })
})
