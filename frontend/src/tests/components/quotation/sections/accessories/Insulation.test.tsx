import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Insulation } from '@/components/quotation/sections/accessories/Insulation'
import { useQuotationStore } from '@/stores/quotation-store'

describe('Insulation', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('renders roof and wall insulation selectors', () => {
    render(<Insulation />)

    expect(screen.getByText('Insulation')).toBeInTheDocument()
    expect(screen.getByText('Roof Insulation')).toBeInTheDocument()
    expect(screen.getByText('Wall Insulation')).toBeInTheDocument()
  })
})
