import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Step13Quotation } from '@/components/quotation/steps/Step13Quotation'

describe('Step13Quotation', () => {
  it('renders the step heading and the letterhead meta', () => {
    render(<Step13Quotation />)

    expect(screen.getByRole('heading', { level: 2, name: 'Quotation' })).toBeInTheDocument()
    expect(screen.getByText('M/S MOCA ARCHITECTS')).toBeInTheDocument()
    expect(screen.getAllByText('FBS/SM/212/17/12/2020').length).toBeGreaterThan(0)
  })

  it('renders all nine chapters plus the contents list', () => {
    render(<Step13Quotation />)

    for (const title of [
      'List of Contents',
      'Scope of Work',
      'Product Specifications',
      'Applicable Codes',
      'Approval Drawings',
      'Quantity Estimation',
      'Pricing',
      'Exclusions',
      'Commercial Terms and Conditions',
      'Contract Form',
    ]) {
      expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument()
    }
  })

  it('renders the pricing grand total', () => {
    render(<Step13Quotation />)

    expect(screen.getByText('₹51,863,812.59')).toBeInTheDocument()
    expect(screen.getByText('Grand Total =')).toBeInTheDocument()
  })

  it('renders the quantity estimation rows with units', () => {
    render(<Step13Quotation />)

    expect(screen.getByText('Roof Purlins')).toBeInTheDocument()
    expect(screen.getByText('28,237.33')).toBeInTheDocument()
  })
})
