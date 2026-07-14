import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SpecProducts } from '@/components/quotation/sections/spec/SpecProducts'
import { useQuotationStore } from '@/stores/quotation-store'

describe('SpecProducts section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('shows an empty state when there are no products', () => {
    render(<SpecProducts />)
    expect(screen.getByText('Product Specification')).toBeInTheDocument()
    expect(screen.getByText('No products added yet.')).toBeInTheDocument()
  })

  it('adds a product row and reassigns its code', () => {
    render(<SpecProducts />)
    fireEvent.click(screen.getByRole('button', { name: 'Add product' }))
    expect(useQuotationStore.getState().spec.products).toEqual([{ code: 'PRODUCT-1' }])
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('writes an edited cell into the store', () => {
    render(<SpecProducts />)
    fireEvent.click(screen.getByRole('button', { name: 'Add product' }))
    fireEvent.change(screen.getByLabelText('Product 1 description'), { target: { value: 'Structural steel' } })
    fireEvent.change(screen.getByLabelText('Product 1 yield strength'), { target: { value: '345' } })
    const [product] = useQuotationStore.getState().spec.products
    expect(product.description).toBe('Structural steel')
    expect(product.yieldStrengthMpa).toBe(345)
  })

  it('removes a product row', () => {
    render(<SpecProducts />)
    fireEvent.click(screen.getByRole('button', { name: 'Add product' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove product 1' }))
    expect(useQuotationStore.getState().spec.products).toEqual([])
    expect(screen.getByText('No products added yet.')).toBeInTheDocument()
  })
})
