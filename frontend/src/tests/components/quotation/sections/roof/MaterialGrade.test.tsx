import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MaterialGrade } from '@/components/quotation/sections/roof/MaterialGrade'
import { useQuotationStore } from '@/stores/quotation-store'

describe('MaterialGrade section', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('hides the field when disabled', () => {
    render(<MaterialGrade />)
    expect(screen.getByText('Material Grade')).toBeInTheDocument()
    expect(screen.queryByText('Grade of Plate Material')).not.toBeInTheDocument()
  })

  it('reveals the grade select when enabled', () => {
    useQuotationStore.getState().toggleRoofSection('materialGrade', true)
    render(<MaterialGrade />)
    expect(screen.getByText('Grade of Plate Material')).toBeInTheDocument()
  })

  it('shows the selected grade label', () => {
    useQuotationStore.getState().toggleRoofSection('materialGrade', true)
    useQuotationStore.getState().setRoof({ gradeOfPlateMaterial: 'FE_400' })
    render(<MaterialGrade />)
    expect(screen.getByText('FE 400')).toBeInTheDocument()
  })

  it('disabling the section clears the grade', () => {
    useQuotationStore.getState().toggleRoofSection('materialGrade', true)
    useQuotationStore.getState().setRoof({ gradeOfPlateMaterial: 'FE_345' })
    useQuotationStore.getState().toggleRoofSection('materialGrade', false)
    expect(useQuotationStore.getState().roof.gradeOfPlateMaterial).toBeUndefined()
  })
})
